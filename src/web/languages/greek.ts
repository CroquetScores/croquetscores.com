// Ελληνικά (νέα ελληνικά, μονοτονικό σύστημα). Ο αναγνώστης προσφωνείται στον
// πληθυντικό ευγενείας, με το «εσείς» και προστακτική, όπως συνηθίζεται στα
// προγράμματα ("Εισαγάγετε", "Δοκιμάστε ξανά"). Τα στοιχεία μενού, τα κουμπιά
// και οι επικεφαλίδες γράφονται σαν απλές ελληνικές προτάσεις: μόνο η πρώτη
// λέξη έχει κεφαλαίο ("Αλλαγή διεύθυνσης email", όχι "Αλλαγή Διεύθυνσης
// Email"). Τα κουμπιά λένε την ενέργεια με ουσιαστικό ("Αρχειοθέτηση",
// "Επαναφορά"). Λέμε "διεύθυνση email" για τη διεύθυνση και "email" για το ίδιο
// το μήνυμα. Λέξεις που αποφασίσαμε: τουρνουά, αγώνισμα (competition), μπλοκ
// (block), νοκ-άουτ (knockout), ελβετικό (Swiss), τόξα (hoops), αγώνας
// (match), παιχνίδι (game), αρχειοθέτηση/επαναφορά, αφαίρεση (remove) και
// διαγραφή (delete), τεστ (test), όμιλος (group). Το "Bye" μένει στα αγγλικά,
// επειδή η ίδια η ιστοσελίδα αναγνωρίζει αυτή τη λέξη.
import type { Language } from "../common/language.js";

export const greek: Language = {
  tag: "el",
  name: "Ελληνικά",
  words: {
    // Τα δικά της πεδία της ιστοσελίδας. Το όνομα της ιστοσελίδας δεν είναι
    // λέξη της γλώσσας κανενός και γι' αυτό μπαίνει στην πρόσκληση που το
    // αναφέρει.
    "site.skipToContent": "Μετάβαση στο περιεχόμενο",
    "navigation.menu": "Μενού",
    "navigation.label": "Κύριο μενού",
    "navigation.home": "Αρχική",
    "navigation.help": "Βοήθεια",
    "navigation.admin": "Διαχείριση",
    "sections.label": "Ενότητες",
    "theme.label": "Θέμα",
    "theme.light": "Φωτεινό",
    "theme.dark": "Σκούρο",
    "theme.system": "Συστήματος",
    "footer.donate": "Δωρεά",
    "footer.plea":
      "Σας αρέσει το {siteName}; Κάντε μια δωρεά για να βοηθήσετε στη συνέχιση της ανάπτυξής του.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Απόρρητο",
    "footer.termsOfUse": "Όροι χρήσης",
    "footer.reportBug": "Αναφορά σφάλματος",
    "beta.banner":
      "Αυτή είναι δοκιμαστική (beta) ιστοσελίδα. Τα δεδομένα μπορεί να μηδενιστούν οποιαδήποτε στιγμή.",
    "privacy.contact":
      "Ερωτήσεις για αυτή τη σελίδα ή για το τι διατηρείται για εσάς: {emailAddress}",
    // Το πλαίσιο που τσεκάρει ο αναγνώστης για να αποδεχτεί τους όρους χρήσης
    // για όσους γράφουν. Οι λέξεις του συνδέσμου αναζητούνται μέσα στις λέξεις
    // του πλαισίου και γίνονται ο σύνδεσμος, γι' αυτό πρέπει να γραφτούν
    // ακριβώς όπως εκεί.
    "termsOfUse.agree": "Αποδέχομαι τους όρους χρήσης",
    "termsOfUse.link": "όρους χρήσης",
    // Κάτω από τους όρους για όσους γράφουν, όπως το privacy.contact κάτω από
    // τη δήλωση απορρήτου.
    "termsOfUse.report":
      "Αναφέρετε ό,τι γράφτηκε ή ρωτήστε για αυτούς τους όρους: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Τσεκάρετε το πλαίσιο για να αποδεχτείτε τους όρους χρήσης.",
    // Λέγεται σε κάθε σελίδα μιας δοκιμαστικής ιστοσελίδας, κάτω από τη γραμμή
    // της ιστοσελίδας.
    "tryWebsite.banner":
      "Αυτός είναι ένας ασφαλής χώρος για να μάθετε το {siteName}. Ό,τι εισαχθεί εδώ μπορεί να αφαιρεθεί οποιαδήποτε στιγμή.",

    "language.label": "Γλώσσα",
    "language.choose": "Αλλαγή",

    // Η ειδοποίηση που λέει στον αναγνώστη ότι υπάρχει κάτι καινούργιο να
    // διαβάσει.
    "whatsNew.public.message": "Υπάρχει κάτι καινούργιο να διαβάσετε.",
    "whatsNew.admin.message":
      "Υπάρχει κάτι καινούργιο για όσους διοργανώνουν τουρνουά.",
    "whatsNew.view": "Δείτε τι νέο υπάρχει",
    "whatsNew.later": "Υπενθύμιση την επόμενη φορά",
    "whatsNew.never": "Να μην εμφανιστεί ξανά αυτή η ειδοποίηση",

    "form.otherwise":
      "Κάτι εδώ δεν είναι σωστό. Ελέγξτε τι εισαγάγατε και δοκιμάστε ξανά.",

    // Το μενού λογαριασμού στην κεφαλίδα: τι εκπροσωπεί το πρόσωπο και κάθε
    // στοιχείο που ανοίγει.
    "account.menu": "Λογαριασμός",
    "account.register": "Εγγραφή",
    "account.signIn": "Σύνδεση",
    "account.forgotPassword": "Ξέχασα τον κωδικό",
    "account.signOut": "Αποσύνδεση",
    "account.profile": "Προφίλ",
    "account.changePassword": "Αλλαγή κωδικού",
    "account.changeEmailAddress": "Αλλαγή διεύθυνσης email",
    "account.changeName": "Αλλαγή ονόματος",
    "account.setPassword": "Ορισμός κωδικού",
    "account.forgetAccount": "Λήθη λογαριασμού",

    "register.title": "Εγγραφή",
    "register.emailAddress": "Διεύθυνση email",
    "register.submit": "Εγγραφή",
    "register.withGoogle": "Εγγραφή με Google",
    "register.or": "ή",
    // Λέγεται πάνω από τη φόρμα όταν η Google επέστρεψε τον αναγνώστη χωρίς να
    // τον αφήσει να μπει, με τον κωδικό που έδωσε ο δρόμος της επιστροφής. Η
    // σελίδα εγγραφής και η σελίδα σύνδεσης τα λένε και οι δύο, γι' αυτό
    // λένε «χρησιμοποιήστε τη διεύθυνση email σας» αντί να ονομάζουν τι κάνει
    // η κάθε φόρμα με αυτή.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Η Google δεν έχει επιβεβαιώσει ότι αυτή η διεύθυνση email είναι δική σας, επομένως δεν μπορεί να χρησιμοποιηθεί εδώ με τη Google. Χρησιμοποιήστε εναλλακτικά τη διεύθυνση email σας παρακάτω.",
    "SignInWithGoogle.LinkedToAnother":
      "Αυτή η διεύθυνση email έχει ήδη λογαριασμό, συνδεδεμένο με διαφορετικό λογαριασμό Google. Συνδεθείτε με εκείνον τον λογαριασμό Google ή με τη διεύθυνση email και τον κωδικό σας.",
    "SignInWithGoogle.NameMissing":
      "Η Google δεν μας είπε το όνομά σας και ο λογαριασμός χρειάζεται ένα. Χρησιμοποιήστε εναλλακτικά τη διεύθυνση email σας παρακάτω.",
    "Google.Unreachable":
      "Δεν ήταν δυνατή η επικοινωνία με τη Google αυτή τη στιγμή. Δοκιμάστε ξανά σε λίγα λεπτά ή χρησιμοποιήστε τη διεύθυνση email σας παρακάτω.",
    "Registration.NotAPerson":
      "Αυτό δεν έμοιαζε να προέρχεται από άνθρωπο. Δοκιμάστε ξανά και, αν συνεχίσει να συμβαίνει, περιμένετε λίγα λεπτά και επιστρέψτε.",

    // Ένας κανόνας που μπορεί να παραβιάσει η διεύθυνση, λεγόμενος κάτω από το
    // πεδίο στο οποίο αναφέρεται.
    "EmailAddress.Missing": "Εισαγάγετε μια διεύθυνση email.",
    "EmailAddress.NoAt": "Μια διεύθυνση email έχει ένα @.",
    "EmailAddress.MoreThanOneAt": "Μια διεύθυνση email έχει ένα μόνο @.",
    "EmailAddress.NoDomain":
      "Μια διεύθυνση email έχει έναν τομέα μετά το @, όπως example.com.",

    "welcome.title": "Ελέγξτε το email σας",
    "welcome.checkEmail":
      "Ένα email είναι καθ' οδόν προς τη διεύθυνση που δώσατε. Ακολουθήστε τον σύνδεσμο που περιέχει για να συνεχίσετε.",
    "welcome.nothingArrived":
      "Αν δεν φτάσει τίποτα σε λίγα λεπτά, κοιτάξτε στον φάκελο ανεπιθύμητων (spam).",
    "welcome.home": "Πίσω στο {siteName}",
    "newConfirmationLink.title": "Λήψη νέου συνδέσμου",
    "newConfirmationLink.explanation":
      "Ο σύνδεσμος για την επιβεβαίωση της διεύθυνσης email σας έχει λήξει. Ζητήστε έναν νέο και θα σταλεί στη διεύθυνση με την οποία εγγραφήκατε.",
    "newConfirmationLink.send": "Στείλτε μου νέο σύνδεσμο",
    "newConfirmationLink.home": "Πίσω στο {siteName}",
    "newConfirmationLink.signIn": "Σύνδεση",
    "newConfirmationLink.sent.title": "Ελέγξτε το email σας",
    "newConfirmationLink.sent.explanation":
      "Ένας νέος σύνδεσμος είναι καθ' οδόν. Ακολουθήστε τον για να επιβεβαιώσετε τη διεύθυνση email σας. Αν δεν φτάσει τίποτα σε λίγα λεπτά, κοιτάξτε στον φάκελο ανεπιθύμητων (spam).",
    "newConfirmationLink.alreadyConfirmed.title":
      "Αυτή η διεύθυνση email έχει ήδη επιβεβαιωθεί",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Δεν υπάρχει κάτι άλλο να επιβεβαιωθεί. Συνδεθείτε με τον κωδικό που δώσατε όταν την επιβεβαιώσατε.",
    "newConfirmationLink.noLongerWorks.title":
      "Αυτός ο σύνδεσμος δεν λειτουργεί πια",
    "newConfirmationLink.noLongerWorks.explanation":
      "Ελέγξτε ότι ακολουθήσατε ολόκληρο τον σύνδεσμο από το email, χωρίς να λείπει κάτι από το τέλος του. Αν και πάλι δεν λειτουργεί, εγγραφείτε ξανά και θα σταλεί νέος σύνδεσμος.",
    "newConfirmationLink.tooMany.title": "Δοκιμάστε ξανά αργότερα",
    "newConfirmationLink.tooMany.explanation":
      "Έχουν σταλεί αρκετοί σύνδεσμοι σε αυτή τη διεύθυνση τελευταία. Περιμένετε μία ώρα και ζητήστε ξανά και στο μεταξύ κοιτάξτε στον φάκελο ανεπιθύμητων (spam).",

    "forgotPassword.title": "Ξεχάσατε τον κωδικό σας;",
    "forgotPassword.emailAddress": "Διεύθυνση email",
    "forgotPassword.submit": "Στείλτε μου τρόπο να μπω ξανά",
    "forgotPassword.home": "Πίσω στο {siteName}",
    "forgotPassword.sent.title": "Ελέγξτε το email σας",
    "forgotPassword.sent.explanation":
      "Αν αυτή η διεύθυνση έχει λογαριασμό, ένας σύνδεσμος για να ορίσετε νέο κωδικό είναι καθ' οδόν. Ακολουθήστε τον μέσα σε μία ώρα. Αν δεν φτάσει τίποτα σε λίγα λεπτά, κοιτάξτε στον φάκελο ανεπιθύμητων (spam).",
    "forgotPassword.tryAgainLater":
      "Έχουν ζητηθεί πολλοί τρόποι επανεισόδου από εδώ τελευταία. Περιμένετε μία ώρα και δοκιμάστε ξανά.",

    "setNewPassword.title": "Ορισμός νέου κωδικού",
    "setNewPassword.password": "Κωδικός",
    "setNewPassword.confirmPassword": "Επιβεβαίωση κωδικού",
    "setNewPassword.submit": "Ορισμός του νέου κωδικού μου",
    "setNewPassword.home": "Πίσω στο {siteName}",
    "setNewPassword.signIn": "Σύνδεση",
    "setNewPassword.askAgain": "Ζητήστε νέο σύνδεσμο",
    "setNewPassword.changed.title": "Ο κωδικός σας άλλαξε",
    "setNewPassword.changed.explanation":
      "Έχετε αποσυνδεθεί από παντού όπου ήσασταν συνδεδεμένοι. Συνδεθείτε με τον νέο κωδικό σας.",
    "setNewPassword.expired.title": "Αυτός ο σύνδεσμος έχει λήξει",
    "setNewPassword.expired.explanation":
      "Ένας σύνδεσμος για τον ορισμό νέου κωδικού ισχύει για μία ώρα. Ζητήστε άλλον και θα σταλεί στην ίδια διεύθυνση.",
    "setNewPassword.noLongerWorks.title":
      "Αυτός ο σύνδεσμος δεν λειτουργεί πια",
    "setNewPassword.noLongerWorks.explanation":
      "Ίσως έχει ήδη χρησιμοποιηθεί ή ίσως λείπει κάτι από το τέλος του. Ζητήστε άλλον, αν τον χρειάζεστε ακόμα.",

    // Λέγεται πάνω από τα πεδία όταν δεν μπορεί να γίνει ο έλεγχος για
    // κωδικούς που έχουν διαρρεύσει.
    "BreachedPasswords.Unreachable":
      "Ο κωδικός σας δεν μπορεί να ελεγχθεί αυτή τη στιγμή, γι' αυτό δεν έχει αλλάξει. Δοκιμάστε ξανά σε λίγα λεπτά· ο σύνδεσμός σας εξακολουθεί να λειτουργεί μέχρι να λήξει.",

    "forgetAccount.title": "Λήθη του λογαριασμού σας",
    "forgetAccount.explanation":
      "Το όνομα και η διεύθυνση email σας μπορούν να γίνουν οριστικά μη αναγνώσιμα και ο λογαριασμός σας να κλείσει. Για να βεβαιωθούμε ότι είστε εσείς, θα στείλουμε πρώτα με email έναν σύνδεσμο στη διεύθυνση του λογαριασμού σας και τίποτα δεν ξεχνιέται μέχρι να τον ακολουθήσετε.",
    "forgetAccount.submit": "Στείλτε μου τον σύνδεσμο με email",
    "forgetAccount.sent.title": "Ελέγξτε το email σας",
    "forgetAccount.sent.explanation":
      "Σας στείλαμε με email έναν σύνδεσμο στη διεύθυνση του λογαριασμού σας. Ισχύει για 15 λεπτά και μόνο όσο είστε συνδεδεμένοι σε αυτόν τον λογαριασμό.",
    "forgetAccount.confirm.title": "Οριστική λήθη του λογαριασμού σας;",
    "forgetAccount.confirm.explanation":
      "Μόλις ξεχαστεί, το όνομα και η διεύθυνση email σας δεν θα μπορούν ποτέ ξανά να διαβαστούν, από κανέναν, και δεν θα μπορείτε να συνδεθείτε στον λογαριασμό σας. Δεν μπορεί να αναιρεθεί.",
    "forgetAccount.confirm.submit": "Λήθη του λογαριασμού μου",
    "forgetAccount.forgotten.title": "Ο λογαριασμός σας έχει ξεχαστεί",
    "forgetAccount.forgotten.explanation":
      "Το όνομα και η διεύθυνση email σας δεν μπορούν πια να διαβαστούν και έχετε αποσυνδεθεί από παντού όπου ήσασταν συνδεδεμένοι.",
    "forgetAccount.noLongerWorks.title": "Αυτός ο σύνδεσμος δεν λειτουργεί πια",
    "forgetAccount.noLongerWorks.explanation":
      "Ίσως έχει λήξει, έχει ήδη χρησιμοποιηθεί ή αφορά λογαριασμό στον οποίο δεν είστε συνδεδεμένοι. Ζητήστε ξανά από τον λογαριασμό σας, αν θέλετε ακόμα να ξεχαστεί.",
    "forgetAccount.lastAdministrator.title":
      "Ο λογαριασμός σας δεν μπορεί να ξεχαστεί",
    "forgetAccount.lastAdministrator.explanation":
      "Είστε ο μοναδικός διαχειριστής αυτής της ιστοσελίδας. Δώστε τον ρόλο του διαχειριστή σε κάποιον άλλον και τότε ο λογαριασμός σας μπορεί να ξεχαστεί.",
    "forgetAccount.askAgain": "Ζητήστε ξανά",
    "forgetAccount.home": "Πίσω στο {siteName}",

    "registrationsSuspended.title": "Οι εγγραφές έχουν αναστολή προς το παρόν",
    "registrationsSuspended.explanation":
      "Μια υπηρεσία που χρειάζεται η εγγραφή δεν είναι προσβάσιμη αυτή τη στιγμή, γι' αυτό κανείς δεν μπορεί να εγγραφεί μέχρι να απαντήσει ξανά. Τίποτα από όσα πληκτρολογήσατε δεν διατηρήθηκε.",
    "registrationsSuspended.tryAgainLater":
      "Δοκιμάστε ξανά σε λίγο. Ο διαχειριστής της ιστοσελίδας έχει ειδοποιηθεί.",
    "registrationsSuspended.home": "Πίσω στο {siteName}",

    "signIn.title": "Σύνδεση",
    "signIn.emailAddress": "Διεύθυνση email",
    "signIn.password": "Κωδικός",
    "signIn.submit": "Σύνδεση",
    "signIn.forgotPassword": "Ξέχασα τον κωδικό;",
    "signIn.register": "Εγγραφή",
    "signIn.withGoogle": "Σύνδεση με Google",
    "signIn.or": "ή",
    "signIn.tryAgainLater":
      "Έχουν γίνει πολλές προσπάθειες τελευταία. Περιμένετε μία ώρα και δοκιμάστε ξανά.",

    // Η μία απάντηση σε λάθος κωδικό και σε διεύθυνση που κανείς δεν
    // καταχώρισε. Δεν λέει ούτε ποιο από τα δύο ήταν ούτε ποιο δεν ήταν.
    "SignIn.Failed":
      "Η διεύθυνση email ή ο κωδικός είναι λάθος. Δοκιμάστε ξανά.",

    "profile.title": "Προφίλ",
    // Η άνω και κάτω τελεία μιας ετικέτας ανήκει στις λέξεις της, αφού οι
    // γλώσσες τη βάζουν διαφορετικά.
    "profile.name": "Όνομα:",
    "profile.emailAddress": "Διεύθυνση email:",

    "changeName.title": "Αλλαγή ονόματος",
    "changeName.name": "Όνομα",
    "changeName.submit": "Αλλαγή ονόματος",

    "setPassword.title": "Ορισμός κωδικού",
    "setPassword.explanation":
      "Ο λογαριασμός σας δεν έχει κωδικό: συνδέεστε με τη Google. Για να μπορείτε να συνδέεστε και με κωδικό, θα στείλουμε με email έναν σύνδεσμο για να ορίσετε έναν στη διεύθυνση {emailAddress}.",
    "setPassword.submit": "Στείλτε μου σύνδεσμο με email",
    "setPassword.sent.title": "Ελέγξτε το email σας",
    "setPassword.sent.explanation":
      "Σας στείλαμε με email έναν σύνδεσμο για να ορίσετε κωδικό. Ισχύει για μία ώρα.",
    "setPassword.profile": "Πίσω στο προφίλ σας",

    "changePassword.title": "Αλλαγή κωδικού",
    "changePassword.currentPassword": "Τρέχων κωδικός",
    "changePassword.password": "Νέος κωδικός",
    "changePassword.passwordConfirmation": "Επιβεβαίωση κωδικού",
    "changePassword.forgotPassword": "Ξέχασα τον κωδικό;",
    "changePassword.submit": "Αλλαγή κωδικού",
    // Κάτω από τον τρέχοντα κωδικό, για τον οποίο μιλάει.
    "ChangePassword.WrongPassword": "Αυτός δεν είναι ο κωδικός σας.",

    "changeEmailAddress.title": "Αλλαγή διεύθυνσης email",
    "changeEmailAddress.emailAddress": "Νέα διεύθυνση email",
    "changeEmailAddress.currentPassword": "Τρέχων κωδικός",
    "changeEmailAddress.submit": "Αποστολή συνδέσμου επιβεβαίωσης",
    "changeEmailAddress.sent.title": "Ελέγξτε το email σας",
    "changeEmailAddress.sent.explanation":
      "Ένας σύνδεσμος για την επιβεβαίωση της μεταφοράς στάλθηκε στη νέα διεύθυνση email. Ακολουθήστε τον, συνδεδεμένοι, για να μεταφέρετε τον λογαριασμό σας εκεί.",
    "changeEmailAddress.confirm.title": "Μεταφορά του λογαριασμού σας",
    "changeEmailAddress.confirm.explanation":
      "Ο λογαριασμός σας θα μεταφερθεί στη διεύθυνση {emailAddress}. Από εδώ και πέρα θα συνδέεστε με αυτή τη διεύθυνση.",
    "changeEmailAddress.confirm.submit": "Μεταφορά του λογαριασμού μου",
    "changeEmailAddress.noLongerWorks.title":
      "Αυτός ο σύνδεσμος δεν λειτουργεί πια",
    "changeEmailAddress.noLongerWorks.explanation":
      "Έχει λήξει, έχει χρησιμοποιηθεί ή δεν στάλθηκε για τον λογαριασμό στον οποίο είστε συνδεδεμένοι. Ζητήστε ξανά από το προφίλ σας.",
    "changeEmailAddress.taken.title": "Ο λογαριασμός σας δεν μεταφέρθηκε",
    "changeEmailAddress.profile": "Πίσω στο προφίλ σας",
    // Κάτω από το πεδίο στο οποίο αναφέρεται το καθένα.
    "ChangeEmailAddress.WrongPassword": "Αυτός δεν είναι ο κωδικός σας.",
    "ChangeEmailAddress.Unchanged":
      "Ο λογαριασμός σας βρίσκεται ήδη σε αυτή τη διεύθυνση.",
    "ChangeEmailAddress.Taken":
      "Αυτή η διεύθυνση email έχει πλέον δικό της λογαριασμό, γι' αυτό ο δικός σας δεν μπορεί να μεταφερθεί εκεί.",

    "confirmEmailAddress.title": "Επιβεβαίωση της διεύθυνσης email σας",
    "confirmEmailAddress.name": "Όνομα",
    "confirmEmailAddress.password": "Κωδικός",
    "confirmEmailAddress.confirmPassword": "Επιβεβαίωση κωδικού",
    "confirmEmailAddress.submit": "Επιβεβαίωση της διεύθυνσης email μου",
    "confirmEmailAddress.signIn": "Σύνδεση",
    "confirmEmailAddress.home": "Πίσω στο {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Η διεύθυνση email σας επιβεβαιώθηκε",
    "confirmEmailAddress.confirmed.explanation":
      "Ο λογαριασμός σας είναι έτοιμος. Συνδεθείτε με τη διεύθυνση email και τον κωδικό που μόλις δώσατε.",
    "confirmEmailAddress.expired.title": "Αυτός ο σύνδεσμος έχει λήξει",
    "confirmEmailAddress.expired.explanation":
      "Ένας σύνδεσμος για την επιβεβαίωση διεύθυνσης email ισχύει για 24 ώρες. Ζητήστε νέον και θα σταλεί στην ίδια διεύθυνση.",
    "confirmEmailAddress.expired.newLink": "Στείλτε μου νέο σύνδεσμο",
    "confirmEmailAddress.noLongerWorks.title":
      "Αυτός ο σύνδεσμος δεν λειτουργεί πια",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Ελέγξτε ότι ακολουθήσατε ολόκληρο τον σύνδεσμο από το email, χωρίς να λείπει κάτι από το τέλος του. Αν και πάλι δεν λειτουργεί, εγγραφείτε ξανά και θα σταλεί νέος σύνδεσμος.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Αυτή η διεύθυνση email έχει ήδη επιβεβαιωθεί",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Δεν υπάρχει τίποτα άλλο να γίνει. Συνδεθείτε με τον κωδικό που δώσατε όταν την επιβεβαιώσατε.",

    // Ένας κανόνας που παραβιάστηκε, με κλειδί τον κωδικό του, ώστε κάθε φόρμα
    // που τον λέει να τον λέει με τον ίδιο τρόπο. Λέγεται σε όποιον τον
    // πληκτρολόγησε, κάτω από το πεδίο που διαβάζει.
    "PersonName.Missing": "Εισαγάγετε ένα όνομα.",
    "PersonName.TooShort": "Ένα όνομα πρέπει να έχει τουλάχιστον 3 χαρακτήρες.",
    "PersonName.TooLong": "Ένα όνομα μπορεί να έχει το πολύ 254 χαρακτήρες.",
    "WorldRankingName.TooShort":
      "Ένα όνομα παγκόσμιας κατάταξης πρέπει να έχει τουλάχιστον 3 χαρακτήρες.",
    "WorldRankingName.TooLong":
      "Ένα όνομα παγκόσμιας κατάταξης μπορεί να έχει το πολύ 254 χαρακτήρες.",
    "Password.Missing": "Εισαγάγετε έναν κωδικό.",
    "Password.TooShort":
      "Ένας κωδικός πρέπει να έχει τουλάχιστον 12 χαρακτήρες.",
    "Password.ConfirmationDiffers":
      "Αυτό δεν είναι ίδιο με τον κωδικό παραπάνω. Πληκτρολογήστε το ξανά.",
    "Password.Breached":
      "Αυτός ο κωδικός έχει εμφανιστεί σε διαρροή δεδομένων κάπου αλλού, γι' αυτό δεν είναι ασφαλές να χρησιμοποιηθεί εδώ. Επιλέξτε άλλον.",

    "javaScriptRequired.title": "Απαιτείται JavaScript",
    "javaScriptRequired.explanation":
      "Η εγγραφή απαιτεί να είναι ενεργοποιημένη η εκτέλεση σεναρίων (JavaScript) για αυτή την ιστοσελίδα, ώστε να μπορεί να ελέγξει ότι όποιος εγγράφεται είναι άνθρωπος. Ενεργοποιήστε την και εγγραφείτε ξανά.",
    "javaScriptRequired.register": "Πίσω στην εγγραφή",
    "javaScriptRequired.home": "Πίσω στο {siteName}",

    "errors.backHome": "Πίσω στο {siteName}",
    "errors.notFound": "Δεν βρέθηκε",
    "errors.refused": "Αυτό δεν μπόρεσε να γίνει",
    "errors.refusedDetail": "Κάτι σε όσα στάλθηκαν δεν ήταν σωστό.",
    "errors.sorry": "Λυπούμαστε",
    "errors.sorryDetail": "Το αίτημα αυτό δεν μπόρεσε να εξυπηρετηθεί.",
    "errors.failed": "Κάτι πήγε στραβά",
    "errors.reference": "Αναφορά {reference}.",
    "errors.recorded":
      "Το σφάλμα έχει καταγραφεί και στάλθηκε email στον διαχειριστή. Βοηθά να στείλετε email στον διαχειριστή με την αναφορά και μια περιγραφή του τι κάνατε.",
    "errors.message": "Στείλτε email στον διαχειριστή",
    "errors.messageSubject": "Σφάλμα {reference} στο {siteName}",
    "errors.messageBody": "Τι έκανα όταν συνέβη αυτό:\n\n",
    "errors.unavailable": "Η ιστοσελίδα δεν είναι διαθέσιμη",
    "errors.unavailableDetail":
      "Η ιστοσελίδα δεν μπορεί να φτάσει σε ό,τι χρειάζεται αυτή τη στιγμή. Δοκιμάστε ξανά αργότερα.",
    "errors.maintenance": "Η ιστοσελίδα είναι εκτός λειτουργίας για συντήρηση.",
    "errors.maintenanceMinutes": "Αναμένεται να επανέλθει σε {minutes} λεπτά.",
    "errors.maintenanceMinute": "Αναμένεται να επανέλθει σε 1 λεπτό.",
    "errors.maintenanceLonger":
      "Διαρκεί περισσότερο από το αναμενόμενο και θα επανέλθει σύντομα.",

    // Οι δύο λίστες της αρχικής σελίδας, τι λέει καθεμία όταν είναι άδεια και ο
    // δρόμος κάτω από αυτές προς κάθε τουρνουά αυτής της χρονιάς.
    "home.recentResults": "Πρόσφατα αποτελέσματα",
    "home.recentResults.none":
      "Δεν έχουν προστεθεί παιχνίδια τις τελευταίες επτά ημέρες.",
    "home.upcomingTournaments": "Επερχόμενα τουρνουά",
    "home.upcomingTournaments.none":
      "Δεν ξεκινούν τουρνουά τις επόμενες εξήντα ημέρες.",
    "home.allTournaments": "Όλα τα τουρνουά του {year}",
    // Η σελίδα μιας χρονιάς: η επικεφαλίδα της.
    "year.heading": "Τουρνουά του {year}",
    // Οι μήνες της σελίδας μιας χρονιάς, που φορτώνονται όταν πατηθούν.
    "year.needsScripting":
      "Οι μήνες μιας χρονιάς ανοίγουν με JavaScript, η οποία είναι απενεργοποιημένη. Ενεργοποιήστε την για αυτή την ιστοσελίδα.",
    "year.showAll": "Εμφάνιση όλων",
    "year.hideAll": "Απόκρυψη όλων",
    "year.monthNone": "Δεν ξεκινούν τουρνουά τον μήνα {month} {year}.",
    "year.monthFailed":
      "Τα τουρνουά δεν μπόρεσαν να φορτωθούν. Δοκιμάστε ξανά.",
    // Η σελίδα ενός αθλήματος σε μια χρονιά: το ίδιο, μόνο για το άθλημα.
    "yearSport.heading": "Τουρνουά {sport} του {year}",
    "yearSport.monthNone":
      "Δεν ξεκινούν τουρνουά {sport} τον μήνα {month} {year}.",
    // Η σελίδα ενός τουρνουά: οι ενότητές της, τι λέει για ένα παιχνίδι, πριν
    // από πόση ώρα προστέθηκε και τι λέει όταν δεν έχει κανένα.
    "tournament.recent": "Πρόσφατα",
    "tournament.summary": "Σύνοψη",
    // Η σύνοψη ενός τουρνουά που παίζεται από ομάδες: οι ομάδες και οι
    // στήλες του πίνακά της.
    // Το πλέγμα ενός τεστ: τίνος καλύτερο από πόσα είναι κάθε αγώνας, η λέξη
    // ανάμεσα στις ομάδες του και τα σύνολά του κάτω από τους αγώνες.
    "test.bestOf": "Κάθε αγώνας είναι ο καλύτερος από {count}.",
    "test.vs": "εναντίον",
    "test.matches": "Αγώνες",
    "test.games": "Παιχνίδια",
    "test.hoops": "Τόξα",
    "teamSummary.tests": "Τεστ",
    "teamSummary.matches": "Αγώνες",
    "teamSummary.games": "Παιχνίδια",
    "teamSummary.hoops": "Τόξα",
    "teamSummary.wins": "Νίκες",
    "teamSummary.losses": "Ήττες",
    "teamSummary.draws": "Ισοπαλίες",
    "teamSummary.for": "Υπέρ",
    "teamSummary.against": "Κατά",
    "teamSummary.net": "Διαφορά",
    "tournament.players": "Παίκτες",
    "search.label": "Αναζήτηση",
    "search.tournaments": "Τουρνουά",
    "search.competitions": "Αγωνίσματα",
    "search.nothingFound": "Δεν βρέθηκε τίποτα.",
    "players.search.label": "Αναζήτηση παικτών",
    "players.search.prompt":
      "Πληκτρολογήστε το όνομα ενός παίκτη για να τον βρείτε.",
    "players.search.none": "Δεν βρέθηκαν παίκτες.",
    "search.more":
      "Εμφανίζονται μόνο οι πρώτοι {count}. Προσθέστε περισσότερο από το όνομα για να περιορίσετε την αναζήτηση.",
    "websitePlayer.tournament": "Τουρνουά",
    // Ένα τεστ στις ενότητες ενός τουρνουά: τα σύντομα ονόματα των δύο ομάδων
    // του.
    "tournament.test": "{first} εναντίον {second}",
    "tournament.notes": "Σημειώσεις",
    "tournament.commentary": "Σχολιασμός",
    "tournament.beat": "νίκησε",
    "tournament.drewWith": "έφερε ισοπαλία με",
    "tournament.ago.seconds": "{count} δευτ.",
    "tournament.ago.minutes": "{count} λεπτά",
    "tournament.ago.hour": "1 ώρα",
    "tournament.ago.hours": "{count} ώρες",
    "tournament.none": "Δεν έχουν παιχτεί ακόμα παιχνίδια.",
    // Η σελίδα των παικτών ενός τουρνουά, όταν δεν έχει κανέναν.
    "players.none": "Δεν έχουν προστεθεί ακόμα παίκτες.",
    // Η σελίδα των σχολιασμών ενός τουρνουά, με τα λόγια της παλιάς
    // ιστοσελίδας: πώς καταχωρίζεται ένας σχολιασμός και ο σύνδεσμος για να
    // ξεκινήσει ένας.
    "commentaries.by": "από",
    "commentaries.start": "Έναρξη νέου σχολιασμού",
    // Η σελίδα που ξεκινά έναν σχολιασμό.
    "startCommentary.title": "Έναρξη νέου σχολιασμού",
    "startCommentary.titleField": "Τίτλος",
    "startCommentary.submit": "Έναρξη σχολιασμού",
    // Το «νέο» λέγεται σε αναγνώστη οθόνης στη θέση του κόκκινου αστερίσκου που
    // σημαδεύει μια σημείωση ή έναν σχολιασμό που δεν έχει διαβαστεί όπως είναι
    // τώρα.
    "marks.new": "νέο",
    // Η σελίδα Σημειώσεων ενός τουρνουά και η σελίδα μιας σημείωσης.
    // Η σελίδα έχει επικεφαλίδα «Σημειώσεις υπευθύνων», ενώ η ενότητά της στη
    // γραμμή είναι «Σημειώσεις» (tournament.notes), που είναι όλος ο χώρος που
    // υπάρχει εκεί.
    "notes.heading": "Σημειώσεις υπευθύνων",
    "notes.none": "Καμία σημείωση ακόμα.",
    "note.edited": "επεξεργάστηκε",
    // Η σελίδα ενός σχολιασμού: τι λέει όταν δεν έχει σχόλια, τι λέει για ένα
    // σχόλιο και το πλαίσιο όπου ο συντάκτης του γράφει το επόμενο.
    "commentary.none": "Δεν έχουν γραφτεί ακόμα σχόλια.",
    "commentary.edited": "επεξεργάστηκε",
    "commentary.edit": "Επεξεργασία",
    "commentary.delete": "Διαγραφή",
    "commentary.comment": "Σχόλιο",
    "commentary.add": "Προσθήκη σχολίου",
    "commentary.notSent":
      "Το σχόλιο δεν μπόρεσε να σταλεί. Φορτώστε ξανά τη σελίδα για να δείτε αν διατηρήθηκε.",
    // Η σελίδα που αλλάζει τον τίτλο ενός σχολιασμού.
    "changeCommentaryTitle.title": "Αλλαγή τίτλου",
    "changeCommentaryTitle.submit": "Αποθήκευση",
    // Η σελίδα ενός σχολίου, όπου ο συντάκτης του το επεξεργάζεται ή το
    // διαγράφει, και η σελίδα που ρωτά πριν διαγραφεί.
    "editComment.title": "Επεξεργασία σχολίου",
    "editComment.save": "Αποθήκευση",
    "deleteComment.title": "Διαγραφή σχολίου",
    "deleteComment.question":
      "Να διαγραφεί αυτό το σχόλιο; Δεν μπορεί να αναιρεθεί.",
    "deleteComment.confirm": "Διαγραφή σχολίου",
    "deleteComment.keep": "Να μείνει",
    // Η σελίδα ενός παίκτη: τα δύο μέρη της, πώς λέγεται ένα παιχνίδι όπως το
    // έπαιξε ο παίκτης και τι λέει κάθε μέρος όταν δεν έχει τίποτα μέσα.
    "player.games": "Παιχνίδια",
    "player.competitions": "Αγωνίσματα",
    "player.beat": "νίκησε",
    "player.lostTo": "έχασε από",
    "player.drewWith": "έφερε ισοπαλία με",
    "player.score": "{score} προς {opponent}",
    "player.noGames": "Δεν έχουν παιχτεί ακόμα παιχνίδια.",
    "player.noCompetitions": "Δεν έχει δηλωθεί ακόμα σε κανένα αγώνισμα.",
    // Η σελίδα ενός μπλοκ: τα σύνολα του πλέγματός του, τι είναι ένα σκορ για
    // τον παίκτη της γραμμής, λεγόμενο φωναχτά αντί να εμφανίζεται, και ένας
    // παίκτης που έχει αποσυρθεί.
    "block.wins": "Νίκες",
    "block.matches": "Αγώνες",
    "block.netGames": "Καθαρά παιχνίδια",
    "block.games": "Παιχνίδια",
    "block.netHoops": "Καθαρά τόξα",
    "block.won": "νίκη",
    "block.lost": "ήττα",
    "block.drawn": "ισοπαλία",
    "block.withdrawn": "αποσύρθηκε",
    // Ένα παιχνίδι που αποσύρθηκε, κάτι που άλλες γλώσσες λένε αλλιώς από έναν
    // παίκτη.
    "block.gameWithdrawn": "αποσύρθηκε",
    "block.losses": "Ήττες",
    // Η στήλη των θέσεων στο τέλος του πλέγματος, της σύνοψης και της
    // εκτύπωσης ενός μπλοκ και τι λέγεται κάτω από καθεμία για το πώς
    // ξεχωρίζουν οι παίκτες που έχουν ίσο αριθμό νικών. Τα καθαρά τόξα
    // έρχονται πρώτα στο δεύτερο, για ένα μπλοκ όπου οι αγώνες είναι ένα μόνο
    // παιχνίδι, όπου τα καθαρά παιχνίδια θα έλεγαν ξανά ό,τι λένε οι νίκες.
    "block.placing": "#",
    "block.tieBreak.netGamesNetHoopsWhoBeatWho":
      "Οι ισοβαθμίες κρίνονται από τα καθαρά παιχνίδια, μετά τα καθαρά τόξα και μετά από το ποιος νίκησε ποιον.",
    "block.tieBreak.netHoopsWhoBeatWho":
      "Οι ισοβαθμίες κρίνονται από τα καθαρά τόξα και μετά από το ποιος νίκησε ποιον.",
    "block.tieBreak.whoBeatWho":
      "Οι ισοβαθμίες κρίνονται από το ποιος νίκησε ποιον.",
    "block.tieBreak.other": "Δεν υπάρχει γνωστός τρόπος διάλυσης ισοβαθμίας.",
    // Οι τρεις όψεις ενός μπλοκ, που προσφέρονται κάτω από την επικεφαλίδα του.
    "competition.views": "Προβολές",
    "competition.view.grid": "Πλέγμα",
    "competition.view.summary": "Σύνοψη",
    "competition.view.orderOfPlay": "Σειρά παιχνιδιών",
    "competition.print": "Εκτύπωση",
    "competition.playedTo": "Παίζεται μέχρι {hoops} τόξα",
    "blockSummary.ranking":
      "Κατάταξη με βάση το ποσοστό των αγώνων που κερδήθηκαν. Οι κανονισμοί ενός τουρνουά μπορεί να κατατάσσουν τους παίκτες του διαφορετικά.",
    "orderOfPlay.none": "Δεν έχουν παιχτεί ακόμα παιχνίδια.",
    "orderOfPlay.column.game": "Παιχνίδι",
    "orderOfPlay.column.date": "Ημερομηνία",
    // Οι γύροι ενός νοκ-άουτ, με τα ονόματα που τους έδινε η παλιά
    // ιστοσελίδα, μετρημένοι από τον τελευταίο προς τα πίσω, και ένα bye
    // τραβηγμένο στη θέση ενός παίκτη.
    "knockout.round.final": "Τελικός",
    "knockout.round.semis": "Ημιτελικοί",
    "knockout.round.quarters": "Προημιτελικοί",
    "knockout.round.number": "Γύρος {number}",
    "knockout.bye": "Bye",
    // Ο πίνακας ενός ελβετικού: τι έχει παίξει και κερδίσει κάθε παίκτης και
    // τα αποτελέσματά του.
    "swiss.games": "Παιχνίδια",
    "swiss.wins": "Νίκες",
    "swiss.winShare": "Ποσοστό νικών",
    "swiss.results": "Αποτελέσματα",
    // Τα βέλη που κυλούν το πλέγμα ενός νοκ-άουτ προς τον τελικό του και πίσω
    // προς τον πρώτο του γύρο.
    "knockout.onward": "Επόμενοι γύροι",
    "knockout.back": "Προηγούμενοι γύροι",
    // Ό,τι έχουν κοινό όλες οι λίστες τουρνουά, στην αρχική σελίδα και σε
    // αυτή μιας χρονιάς: οι στήλες των οποίων είναι πίνακας η καθεμία και ό,τι
    // τις περιορίζει.
    "tournamentList.column.date": "Ημερομηνία",
    "tournamentList.column.name": "Όνομα",
    // Μια σημαία, που περιορίζει τις λίστες στη χώρα της, με το όνομα αυτού
    // που κάνει.
    "tournamentList.onlyIn": "Μόνο τουρνουά σε {country}",
    "tournamentList.usualOrder": "Πίσω στη συνηθισμένη σειρά",
    "tournamentList.filter.country": "Χώρα",
    "tournamentList.filter.anyCountry": "Οποιαδήποτε χώρα",
    "tournamentList.filter.region": "Περιοχή",
    "tournamentList.filter.anyRegion": "Οποιαδήποτε περιοχή",
    "tournamentList.filter.noRegionsBefore":
      "Τα τουρνουά πριν από τον Νοέμβριο του 2026 δεν έχουν περιοχές.",
    "tournamentList.filter.sport": "Άθλημα",
    "tournamentList.filter.anySport": "Οποιοδήποτε άθλημα",
    "tournamentList.filter.submit": "Φιλτράρισμα",
    "tournamentList.filter.from": "Από",
    "tournamentList.filter.to": "Έως",
    "tournamentsInDays.heading": "Τουρνουά από {from} έως {to}",
    "tournamentsInDays.headingAll": "Τουρνουά",
    "tournamentsInDays.none": "Δεν ξεκινούν τουρνουά αυτές τις ημέρες.",
    "tournamentsInDays.previous": "Προηγούμενη",
    "tournamentsInDays.next": "Επόμενη",
    "tournamentsInDays.page": "Σελίδα {page} από {last}",
    // Οι χρονιές στις οποίες υπάρχουν τουρνουά, η δευτερεύουσα πλοήγηση και των
    // δύο.
    "years.label": "Χρονιές",
    // Η αναπτυσσόμενη λίστα που κρατά τις χρονιές που δεν χωρούν ως καρτέλες.
    "years.earlier": "Προηγούμενες χρονιές",

    // Τα λόγια της διαχείρισης. Η διαχείριση τα σχεδιάζει στον περιηγητή, γι'
    // αυτό ο διακομιστής τα λέει μέσα στη σελίδα της καθώς την στέλνει
    // (adminPage.ts): αυτά και οι αρνήσεις του τουρνουά παρακάτω.
    "admin.newerBuild.message":
      "Υπάρχει διαθέσιμη νεότερη έκδοση αυτής της ιστοσελίδας.",
    "admin.newerBuild.reload": "Φόρτωση ξανά",
    "admin.title": "Διαχείριση",
    "admin.tournaments.new": "Νέο τουρνουά",
    "admin.tournaments.none": "Κανένα τουρνουά",
    "admin.tournaments.filter.none": "Κανένα τουρνουά δεν ταιριάζει",
    "admin.tournaments.show": "Εμφάνιση",
    "admin.tournaments.managerScorer": "Υπεύθυνος/Καταχωρητής",
    "admin.tournaments.worldRanking": "Παγκόσμια κατάταξη",
    "admin.tournaments.notWorldRanking": "Εκτός παγκόσμιας κατάταξης",
    // Λέγεται σε αναγνώστη οθόνης, αφού μια γραμμή πάνω από ένα όνομα δεν
    // διαβάζεται φωναχτά.
    "admin.tournaments.archived": "Αρχειοθετημένο",
    "admin.tournaments.manage": "Διαχείριση",
    "admin.tournaments.edit": "Επεξεργασία",
    "admin.tournaments.archive": "Αρχειοθέτηση",
    "admin.tournaments.restore": "Επαναφορά",
    "admin.tournaments.scores": "Αποτελέσματα",
    "admin.tournaments.players": "Παίκτες",
    "admin.years.label": "Χρονιές",
    // Τι λέει η αναπτυσσόμενη λίστα των χρονιών όσο η χρονιά που επιλέχθηκε
    // είναι καρτέλα.
    "admin.years.earlier": "Προηγούμενες χρονιές",
    "admin.tournament.name": "Όνομα",
    "admin.tournament.starts": "Έναρξη",
    "admin.tournament.finishes": "Λήξη",
    "admin.tournament.format": "Μορφή",
    "admin.tournament.sport": "Άθλημα",
    "admin.tournament.country": "Χώρα",
    "admin.tournament.region": "Περιοχή",
    "admin.tournament.subtitle": "Υπότιτλος",
    "admin.rules.handicap": "Παίζεται με χάντικαπ",
    "admin.rules.drawsAllowed": "Επιτρέπει ισόπαλα αποτελέσματα",
    "admin.tournament.levelTestsDrawn": "Τα ισόπαλα τεστ λογίζονται ισοπαλία",
    "admin.rules.worldRankings": "Μετράει για τις παγκόσμιες κατατάξεις",
    "admin.rules.maximumHoops": "Μέγιστα τόξα",
    "admin.tournament.national": "Εθνικού επιπέδου διοργάνωση",
    "admin.tournament.international": "Διεθνούς επιπέδου διοργάνωση",
    // Μια άρνηση χωρίς δικά της λόγια, πάνω από τα πεδία.
    "admin.tournament.otherwise": "Αυτό δεν μπορεί να γίνει δεκτό ως έχει.",
    "admin.newTournament.title": "Νέο τουρνουά",
    "admin.newTournament.submit": "Δημιουργία τουρνουά",
    "admin.editTournament.title": "Επεξεργασία τουρνουά",
    "admin.editTournament.submit": "Ενημέρωση τουρνουά",
    // Λέγεται στη θέση της φόρμας, για μια άρνηση χωρίς δικά της λόγια.
    "admin.editTournament.otherwise": "Αυτό το τουρνουά δεν μπορεί να αλλάξει.",
    // Η σελίδα ενός τουρνουά και οι καρτέλες όπου βρίσκεται ό,τι υπάρχει να
    // διαχειριστεί.
    "admin.view.tabs": "Τουρνουά",
    "admin.view.players": "Παίκτες",
    "admin.view.competitions": "Αγωνίσματα",
    "admin.view.managers": "Υπεύθυνοι",
    "admin.view.notes": "Σημειώσεις",
    "admin.view.scorers": "Καταχωρητές",
    "admin.view.rankings": "Κατατάξεις",
    "admin.rankings.file":
      "Οι παγκόσμιες κατατάξεις θα χρησιμοποιούν τα αποτελέσματα του τουρνουά μέσα από αυτή τη λειτουργία, γι' αυτό οι υπεύθυνοι δεν χρειάζεται να κάνουν τίποτα.",
    "admin.rankings.download": "Λήψη παιχνιδιών για την παγκόσμια κατάταξη",
    "rankings.notAvailable": "Οι κατατάξεις δεν είναι διαθέσιμες",
    "rankings.notAvailable.sport":
      "Το άθλημα αυτού του τουρνουά δεν έχει παγκόσμιες κατατάξεις, γι' αυτό δεν υπάρχουν κατατάξεις για αποστολή.",
    "rankings.notAvailable.notCounted":
      "Κανένα από τα αγωνίσματα αυτού του τουρνουά δεν μετράει για τις παγκόσμιες κατατάξεις.",
    // Λέγεται στη θέση των καρτελών, για μια άρνηση χωρίς δικά της λόγια.
    "admin.view.otherwise":
      "Αυτό το τουρνουά δεν μπορεί να διαχειριστεί από εδώ.",
    // Η σελίδα ενός αγωνίσματος και οι καρτέλες όπου βρίσκεται ό,τι υπάρχει
    // να διαχειριστεί.
    "admin.competitionView.tabs": "Αγώνισμα",
    "admin.competitionView.players": "Παίκτες",
    "admin.competitionView.scores": "Αποτελέσματα",
    "admin.competitionView.losers": "Ηττημένοι",
    "admin.losers.add": "Προσθήκη νοκ-άουτ ηττημένων",
    "admin.losers.round": "Ηττημένοι του",
    "admin.losers.option": "{round} ({count} ηττημένοι)",
    "admin.losers.name": "Όνομα νοκ-άουτ ηττημένων",
    "admin.losers.none": "Κανένα νοκ-άουτ ηττημένων.",
    "admin.losers.noRounds":
      "Αυτό το νοκ-άουτ δεν έχει γύρο του οποίου οι ηττημένοι θα μπορούσαν να συνεχίσουν.",
    "admin.losers.remove": "Αφαίρεση",
    "admin.losers.readOnly":
      "Οι παίκτες αυτού του νοκ-άουτ είναι οι ηττημένοι ενός άλλου νοκ-άουτ, που μπαίνουν εδώ καθώς κρίνεται κάθε αγώνας.",
    "admin.hover.losers.add":
      "Προσθήκη νοκ-άουτ για τους ηττημένους ενός από τους γύρους αυτού του νοκ-άουτ",
    "Tournament.NoSuchRound":
      "Το νοκ-άουτ δεν έχει τέτοιο γύρο που στέλνει τους ηττημένους παρακάτω.",
    "Tournament.KnockoutHasLosersKnockouts":
      "Ένα άλλο νοκ-άουτ παίρνει τους ηττημένους αυτού, γι' αυτό οι θέσεις του δεν μπορούν να αλλάξουν.",
    "Tournament.KnockoutHasLosersKnockoutsInUse":
      "Ένα άλλο νοκ-άουτ σε χρήση παίρνει τους ηττημένους αυτού, γι' αυτό αρχειοθετήστε πρώτα εκείνο.",
    "Tournament.LosersKnockoutSourceArchived":
      "Αυτό το νοκ-άουτ ηττημένων παίρνει τους ηττημένους ενός νοκ-άουτ που είναι αρχειοθετημένο, γι' αυτό επαναφέρετε πρώτα εκείνο.",
    "Tournament.LosersKnockoutPlacesFixed":
      "Ένα νοκ-άουτ ηττημένων έχει τόσες θέσεις όσους αγώνες έχει ο γύρος από τον οποίο παίρνει τους ηττημένους.",
    "Competition.PlayersSetAutomatically":
      "Οι παίκτες ενός νοκ-άουτ ηττημένων μπαίνουν εκεί καθώς κρίνονται οι αγώνες, όχι με το χέρι.",
    // Η γραμμή ενοτήτων της σελίδας ενός τουρνουά και των σελίδων των
    // αγωνισμάτων του.
    "admin.sections.label": "Το τουρνουά και τα αγωνίσματά του",
    "admin.sections.tournament": "Τουρνουά",
    // Η γραμμή ενοτήτων των σελίδων του διαχειριστή.
    "admin.administrator.sections.label": "Οι σελίδες του διαχειριστή",
    "admin.administrator.sections.tournaments": "Τουρνουά",
    "admin.administrator.sections.accounts": "Λογαριασμοί",
    "admin.administrator.sections.worldRankings": "Παγκόσμιες κατατάξεις",
    "admin.administrator.sections.importErrors": "Σφάλματα εισαγωγής",
    "admin.administrator.sections.logs": "Αρχεία καταγραφής",
    "admin.administrator.sections.databaseStatus":
      "Πρόσβαση στη βάση δεδομένων",
    "admin.administrator.sections.countries": "Χώρες",
    "admin.databaseStatus.title": "Πρόσβαση στη βάση δεδομένων",
    "admin.databaseStatus.on": "Η πρόσβαση στη βάση δεδομένων είναι ενεργή.",
    "admin.databaseStatus.off":
      "Η πρόσβαση στη βάση δεδομένων είναι απενεργοποιημένη.",
    "admin.databaseStatus.expected":
      "Η ιστοσελίδα αναμένεται να επανέλθει σε {minutes} λεπτά.",
    "admin.databaseStatus.expectedOne":
      "Η ιστοσελίδα αναμένεται να επανέλθει σε 1 λεπτό.",
    "admin.databaseStatus.longer": "Διαρκεί περισσότερο από το αναμενόμενο.",
    "admin.databaseStatus.told": "Στους αναγνώστες λέγεται: {words}",
    "admin.databaseStatus.toldUsual":
      "Στους αναγνώστες λέγεται η συνηθισμένη πρόταση.",
    "admin.databaseStatus.minutes": "Λεπτά που αναμένονται",
    "admin.databaseStatus.words": "Λόγια για τους αναγνώστες",
    "admin.databaseStatus.turnOff": "Απενεργοποίηση",
    "admin.databaseStatus.change": "Αλλαγή",
    "admin.databaseStatus.turnOn": "Ενεργοποίηση",
    "admin.databaseStatus.minutesNeeded": "Τα λεπτά είναι απαραίτητα.",
    "admin.databaseStatus.otherwise": "Κάτι πήγε στραβά στην ιστοσελίδα.",
    "DatabaseAccess.MinutesNotWhole":
      "Τα λεπτά πρέπει να είναι ακέραιος αριθμός.",
    "DatabaseAccess.MinutesOutOfRange":
      "Τα λεπτά πρέπει να είναι από 1 έως 1440.",
    "DatabaseAccess.WordsTooLong":
      "Τα λόγια δεν πρέπει να ξεπερνούν τους 500 χαρακτήρες.",
    "DatabaseAccess.NotOff":
      "Η πρόσβαση στη βάση δεδομένων δεν είναι απενεργοποιημένη.",
    "admin.administrator.title": "Διαχειριστής",
    // Η σελίδα των λογαριασμών, με μια ενότητα για κάθε ρόλο.
    "admin.accounts.title": "Λογαριασμοί",
    "admin.roles.add": "Προσθήκη",
    "admin.roles.administrator.heading": "Διαχειριστές",
    "admin.roles.administrator.none": "Κανένας άλλος διαχειριστής",
    "admin.roles.administrator.removeTitle": "Αφαίρεση διαχειριστή",
    "admin.roles.administrator.removeExplanation":
      "{name} δεν θα είναι πια διαχειριστής αυτής της ιστοσελίδας.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Υπεύθυνοι παγκόσμιας κατάταξης Association Croquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Κανένας υπεύθυνος παγκόσμιας κατάταξης Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Αφαίρεση υπευθύνου παγκόσμιας κατάταξης Association Croquet",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} δεν θα είναι πια υπεύθυνος παγκόσμιας κατάταξης Association Croquet.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Υπεύθυνοι παγκόσμιας κατάταξης Golf Croquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Κανένας υπεύθυνος παγκόσμιας κατάταξης Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Αφαίρεση υπευθύνου παγκόσμιας κατάταξης Golf Croquet",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} δεν θα είναι πια υπεύθυνος παγκόσμιας κατάταξης Golf Croquet.",
    // Για μια άρνηση χωρίς δικά της λόγια, κάτω από το πεδίο ή στη θέση της
    // λίστας. Δεν αναφέρεται στη διεύθυνση, αφού μπορεί να έληξε η συνεδρία ή
    // να απέτυχε η ιστοσελίδα.
    // Η σελίδα όπου εισάγονται οι παίκτες της παγκόσμιας κατάταξης και το
    // αρχείο καταγραφής της, μια γραμμή για καθετί που λέει η εισαγωγή. Ένα
    // πλήθος λέγεται μετά από άνω και κάτω τελεία, ώστε ένας παίκτης και
    // πολλοί να λέγονται με τον ίδιο τρόπο.
    "admin.worldRankings.title": "Εισαγωγή παικτών παγκόσμιας κατάταξης",
    "admin.worldRankings.import": "Εισαγωγή",
    "admin.worldRankings.log": "Πώς πήγε η εισαγωγή",
    "admin.worldRankings.ac.reading": "Ανάγνωση της λίστας association croquet",
    "admin.worldRankings.ac.read":
      "Παίκτες association croquet που διαβάστηκαν: {players}",
    "admin.worldRankings.ac.kept":
      "Παίκτες association croquet που κρατήθηκαν: {players}",
    "admin.worldRankings.ac.refused":
      "Η λίστα association croquet δεν μπόρεσε να διαβαστεί, γι' αυτό οι παίκτες της έμειναν όπως ήταν.",
    "admin.worldRankings.gc.reading": "Ανάγνωση της λίστας golf croquet",
    "admin.worldRankings.gc.read":
      "Παίκτες golf croquet που διαβάστηκαν: {players}",
    "admin.worldRankings.gc.kept":
      "Παίκτες golf croquet που κρατήθηκαν: {players}",
    "admin.worldRankings.gc.refused":
      "Η λίστα golf croquet δεν μπόρεσε να διαβαστεί, γι' αυτό οι παίκτες της έμειναν όπως ήταν.",
    "admin.worldRankings.finished": "Ολοκληρώθηκε",
    "admin.worldRankings.failed": "Η εισαγωγή δεν ολοκληρώθηκε.",
    // Για μια άρνηση χωρίς δικά της λόγια, ως αποτυχία της ιστοσελίδας.
    "admin.worldRankings.otherwise": "Κάτι πήγε στραβά στην ιστοσελίδα.",
    "WorldRankingLists.Unreachable":
      "Η ιστοσελίδα των παγκόσμιων κατατάξεων δεν ήταν προσβάσιμη.",
    "WorldRankingLists.Unreadable":
      "Η λίστα δεν έχει τη διάταξη που δίνουν οι παγκόσμιες κατατάξεις στη δική τους: μια γραμμή της δεν μπόρεσε να διαβαστεί, δεν έχει κανέναν, ή δεν είναι γραμμένη σε UTF-8.",
    // Τα έγγραφα που απέρριψε η εισαγωγή από τις παλιές ιστοσελίδες και η
    // σελίδα ενός από αυτά.
    "admin.importErrors.title": "Σφάλματα εισαγωγής",
    "admin.importErrors.none": "Κανένα σφάλμα εισαγωγής",
    "admin.importErrors.otherwise": "Κάτι πήγε στραβά στην ιστοσελίδα.",
    "admin.countries.title": "Χώρες",
    "admin.countries.none":
      "Κανένα τουρνουά δεν παίζεται σε χώρα που δεν ονομάζουν οι λίστες",
    "admin.countries.oldSite": "Παλιά ιστοσελίδα",
    "admin.countries.otherwise": "Κάτι πήγε στραβά στην ιστοσελίδα.",
    "admin.logs.title": "Αρχεία καταγραφής",
    "admin.logs.severity": "Σοβαρότητα",
    "admin.logs.text": "Αναζήτηση",
    "admin.logs.show": "Εμφάνιση",
    "admin.logs.prune": "Κλάδεμα",
    "admin.logs.pruneAsk":
      "Να αφαιρεθεί το αρχείο καταγραφής πριν από την τελευταία ώρα; Τίποτα δεν το επαναφέρει.",
    "admin.logs.removed": "Αφαιρέθηκαν {count} εγγραφές",
    "admin.logs.none": "Καμία εγγραφή καταγραφής",
    "admin.logs.otherwise": "Κάτι πήγε στραβά στην ιστοσελίδα.",
    "admin.hover.logs.show": "Εμφάνιση των εγγραφών που ταιριάζουν",
    "admin.hover.logs.prune":
      "Αφαίρεση του αρχείου καταγραφής πριν από την τελευταία ώρα",
    "admin.hover.logs.pruneAgree":
      "Αφαίρεση του αρχείου καταγραφής πριν από την τελευταία ώρα",
    "admin.importError.title": "Σφάλμα εισαγωγής",
    "admin.importError.documentId": "Αναγνωριστικό εγγράφου",
    "admin.importError.tournament": "Τουρνουά",
    "admin.importError.competition": "Αγώνισμα",
    "admin.importError.newSite": "Νέα ιστοσελίδα",
    "admin.importError.oldSite": "Παλιά ιστοσελίδα",
    "ImportErrorKept.NotFound":
      "Η εισαγωγή δεν κράτησε σφάλμα για αυτό το έγγραφο.",
    "admin.competitionView.otherwise":
      "Αυτό το αγώνισμα δεν μπορεί να διαχειριστεί από εδώ.",
    // Η καρτέλα Αγωνίσματα: το είδος κάθε αγωνίσματος, τι μπορεί να γίνει με
    // αυτό και η επικεφαλίδα κάτω από την οποία βρίσκονται τα αρχειοθετημένα.
    "admin.competitions.block": "Μπλοκ",
    "admin.competitions.knockout": "Νοκ-άουτ",
    "admin.competitions.swiss": "Ελβετικό",
    "admin.competitions.view": "Προβολή",
    "admin.competitions.edit": "Επεξεργασία",
    "admin.competitions.up": "Πάνω",
    "admin.competitions.down": "Κάτω",
    "admin.competitions.archive": "Αρχειοθέτηση",
    "admin.competitions.restore": "Επαναφορά",
    "admin.competitions.archived": "Αρχειοθετημένα αγωνίσματα",
    "admin.competitions.none": "Κανένα αγώνισμα",
    "admin.competitions.add": "Προσθήκη αγωνίσματος",
    // Το παράθυρο διαλόγου του αγωνίσματος.
    "admin.competition.addTitle": "Προσθήκη αγωνίσματος",
    "admin.competition.editTitle": "Επεξεργασία αγωνίσματος",
    "admin.competition.name": "Όνομα",
    "admin.competition.kind": "Είδος",
    "admin.competition.bestOf": "Καλύτερος από",
    "admin.competition.rounds": "Γύροι",
    "admin.competition.tieBreaks": "Ισοβαθμίες",
    "admin.competition.tieBreak.net-games-net-hoops-who-beat-who":
      "Καθαρά παιχνίδια, μετά καθαρά τόξα, μετά ποιος νίκησε ποιον",
    "admin.competition.tieBreak.who-beat-who": "Ποιος νίκησε ποιον",
    "admin.competition.tieBreak.other": "Άλλο",
    "admin.competition.places": "Θέσεις",
    "admin.competition.round": "Γύρος {number}",
    "admin.competition.bestOfs": "Καλύτερος από ανά γύρο",
    "admin.competition.quarters": "Προημιτελικοί",
    "admin.competition.semis": "Ημιτελικοί",
    "admin.competition.final": "Τελικός",
    "admin.competition.add": "Προσθήκη",
    "admin.competition.save": "Αποθήκευση",
    "admin.competition.added": "Το αγώνισμα {name} προστέθηκε.",
    // Πάνω από τα πεδία, για μια άρνηση χωρίς δικά της λόγια.
    "admin.competition.otherwise":
      "Αυτό το αγώνισμα δεν μπορεί να κρατηθεί ως έχει.",
    "CompetitionName.Missing": "Εισαγάγετε ένα όνομα.",
    "CompetitionName.TooLong":
      "Ένα όνομα μπορεί να έχει το πολύ 254 χαρακτήρες.",
    "CompetitionName.NoLetterOrDigit":
      "Ένα όνομα χρειάζεται ένα γράμμα ή ένα ψηφίο.",
    "Tournament.KnockoutPlayerHasGames":
      "Οι παίκτες αυτής της κλήρωσης έχουν παιχνίδια, γι' αυτό οι θέσεις της δεν μπορούν να αλλάξουν.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Ένας γύρος με κριθέντα αγώνα δεν μπορεί να γίνει συντομότερο «καλύτερος από».",
    "Tournament.KnockoutLaterRoundHasGames":
      "Ένας γύρος δεν μπορεί να αλλάξει μόλις παιχτεί ένα παιχνίδι σε μεταγενέστερο γύρο.",
    "Tournament.CompetitionNameTaken":
      "Ένα άλλο αγώνισμα σε αυτό το τουρνουά έχει ήδη αυτό το όνομα.",
    "Tournament.MaximumHoopsInvalid":
      "Εισαγάγετε έναν ακέραιο αριθμό τόξων, τουλάχιστον 1, ή αφήστε το κενό για να μην υπάρχει μέγιστο.",
    "BestOf.NotWhole": "Εισαγάγετε έναν ακέραιο αριθμό παιχνιδιών.",
    "BestOf.TooSmall":
      "Ένας αγώνας πρέπει να είναι ο καλύτερος από τουλάχιστον 1 παιχνίδι.",
    "Rounds.NotWhole": "Εισαγάγετε έναν ακέραιο αριθμό γύρων.",
    "Rounds.TooSmall": "Ένα μπλοκ πρέπει να παιχτεί σε τουλάχιστον 1 γύρο.",
    "KnockoutDraw.EvenBestOf":
      "Ο αγώνας ενός νοκ-άουτ πρέπει να έχει νικητή, γι' αυτό είναι ο καλύτερος από περιττό αριθμό παιχνιδιών.",
    // Η έξοδος κάθε παραθύρου διαλόγου, αφού η σελίδα από κάτω δεν είναι
    // προσβάσιμη.
    "admin.hover.tournaments.new": "Δημιουργία νέου τουρνουά",
    "admin.hover.tournaments.manage":
      "Διαχείριση των παικτών, των ομάδων, των αγωνισμάτων και των αποτελεσμάτων αυτού του τουρνουά",
    "admin.hover.tournaments.edit": "Αλλαγή των στοιχείων αυτού του τουρνουά",
    "admin.hover.tournaments.scores":
      "Καταχώριση των αποτελεσμάτων αυτού του τουρνουά",
    "admin.hover.tournaments.players":
      "Φροντίδα για τους παίκτες αυτού του τουρνουά",
    "admin.hover.competitions.view":
      "Άνοιγμα αυτού του αγωνίσματος για να δείτε και να καταχωρίσετε τους παίκτες και τα αποτελέσματά του",
    "admin.hover.tests.view":
      "Άνοιγμα αυτού του τεστ για να δείτε και να καταχωρίσετε τα αποτελέσματά του",
    "admin.hover.teams.view":
      "Άνοιγμα αυτής της ομάδας για να δείτε και να διαχειριστείτε τους παίκτες της",
    "admin.hover.dialog.player.add": "Προσθήκη αυτού του παίκτη στο τουρνουά",
    "admin.hover.dialog.player.save":
      "Διατήρηση των αλλαγών σε αυτόν τον παίκτη",
    "admin.hover.dialog.team.add": "Προσθήκη αυτής της ομάδας στο τουρνουά",
    "admin.hover.dialog.team.save": "Διατήρηση των αλλαγών σε αυτή την ομάδα",
    "admin.hover.dialog.test.add": "Προσθήκη αυτού του τεστ στο τουρνουά",
    "admin.hover.dialog.test.save": "Διατήρηση των αλλαγών σε αυτό το τεστ",
    "admin.hover.dialog.competition.add":
      "Προσθήκη αυτού του αγωνίσματος στο τουρνουά",
    "admin.hover.dialog.competition.save":
      "Διατήρηση των αλλαγών σε αυτό το αγώνισμα",
    "admin.hover.dialog.score.add":
      "Προσθήκη αυτού του αποτελέσματος στο αγώνισμα",
    "admin.hover.dialog.score.save":
      "Διατήρηση της διόρθωσης σε αυτό το αποτέλεσμα",
    "admin.hover.dialog.carryForward.save":
      "Μεταφορά των αποτελεσμάτων αυτού του παίκτη",
    "admin.hover.dialog.tournament.new": "Δημιουργία αυτού του τουρνουά",
    "admin.hover.dialog.tournament.edit":
      "Διατήρηση των αλλαγών σε αυτό το τουρνουά",
    "admin.hover.modal.cancel": "Κλείσιμο χωρίς να διατηρηθεί τίποτα",
    "admin.hover.modal.ok": "Κλείσιμο αυτού του μηνύματος",
    "admin.hover.tab": "Εμφάνιση της καρτέλας {name}",
    "admin.hover.tournaments.archive":
      "Αρχειοθέτηση αυτού του τουρνουά· μπορεί να επαναφερθεί",
    "admin.hover.tournaments.restore":
      "Επαναφορά αυτού του αρχειοθετημένου τουρνουά",
    "admin.hover.players.add": "Προσθήκη ενός παίκτη σε αυτό το τουρνουά",
    "admin.hover.players.addMany":
      "Προσθήκη πολλών παικτών σε αυτό το τουρνουά ταυτόχρονα",
    "admin.hover.dialog.players.add": "Προσθήκη αυτών των παικτών στο τουρνουά",
    "admin.hover.players.edit": "Αλλαγή των στοιχείων αυτού του παίκτη",
    "admin.hover.players.up": "Μετακίνηση αυτού του παίκτη πάνω στη λίστα",
    "admin.hover.players.down": "Μετακίνηση αυτού του παίκτη κάτω στη λίστα",
    "admin.hover.players.archive":
      "Αρχειοθέτηση αυτού του παίκτη· μπορεί να επαναφερθεί",
    "admin.hover.players.restore": "Επαναφορά αυτού του αρχειοθετημένου παίκτη",
    "admin.hover.teams.add": "Προσθήκη μιας ομάδας σε αυτό το τουρνουά",
    "admin.hover.teams.edit": "Αλλαγή των στοιχείων αυτής της ομάδας",
    "admin.hover.teams.up": "Μετακίνηση αυτής της ομάδας πάνω στη λίστα",
    "admin.hover.teams.down": "Μετακίνηση αυτής της ομάδας κάτω στη λίστα",
    "admin.hover.teams.archive":
      "Αρχειοθέτηση αυτής της ομάδας· μπορεί να επαναφερθεί",
    "admin.hover.teams.restore": "Επαναφορά αυτής της αρχειοθετημένης ομάδας",
    "admin.hover.competitions.add":
      "Προσθήκη ενός αγωνίσματος σε αυτό το τουρνουά",
    "admin.hover.competitions.edit":
      "Αλλαγή των στοιχείων αυτού του αγωνίσματος",
    "admin.hover.competitions.up":
      "Μετακίνηση αυτού του αγωνίσματος πάνω στη λίστα",
    "admin.hover.competitions.down":
      "Μετακίνηση αυτού του αγωνίσματος κάτω στη λίστα",
    "admin.hover.competitions.archive":
      "Αρχειοθέτηση αυτού του αγωνίσματος· μπορεί να επαναφερθεί",
    "admin.hover.competitions.restore":
      "Επαναφορά αυτού του αρχειοθετημένου αγωνίσματος",
    "admin.hover.tests.add": "Προσθήκη ενός τεστ ανάμεσα σε δύο ομάδες",
    "admin.hover.tests.edit": "Αλλαγή των στοιχείων αυτού του τεστ",
    "admin.hover.tests.up": "Μετακίνηση αυτού του τεστ πάνω στη λίστα",
    "admin.hover.tests.down": "Μετακίνηση αυτού του τεστ κάτω στη λίστα",
    "admin.hover.tests.archive":
      "Αρχειοθέτηση αυτού του τεστ· μπορεί να επαναφερθεί",
    "admin.hover.tests.restore": "Επαναφορά αυτού του αρχειοθετημένου τεστ",
    "admin.hover.tests.toTeams":
      "Μετάβαση στην καρτέλα Ομάδες για να προσθέσετε τις ομάδες που χρειάζεται ένα τεστ",
    "admin.hover.scores.add":
      "Προσθήκη του αποτελέσματος ενός παιχνιδιού σε αυτό το αγώνισμα",
    "admin.hover.scores.edit": "Διόρθωση αυτού του αποτελέσματος",
    "admin.hover.scores.archive":
      "Αρχειοθέτηση αυτού του αποτελέσματος ώστε να πάψει να μετράει· μπορεί να επαναφερθεί",
    "admin.hover.scores.restore":
      "Επαναφορά αυτού του αρχειοθετημένου αποτελέσματος, ώστε να μετράει ξανά",
    "admin.hover.scores.withdraw":
      "Διατήρηση αυτού του αποτελέσματος στη λίστα αλλά παύση της μέτρησής του",
    "admin.hover.scores.unwithdraw":
      "Να μετράει ξανά αυτό το αποσυρμένο αποτέλεσμα",
    "admin.hover.scores.up":
      "Μετακίνηση αυτού του αποτελέσματος νωρίτερα στη λίστα",
    "admin.hover.scores.down":
      "Μετακίνηση αυτού του αποτελέσματος αργότερα στη λίστα",
    "admin.hover.competitionPlayers.add":
      "Τοποθέτηση του επιλεγμένου παίκτη σε αυτό το αγώνισμα",
    "admin.hover.competitionPlayers.up":
      "Μετακίνηση αυτού του παίκτη πάνω στη λίστα",
    "admin.hover.competitionPlayers.down":
      "Μετακίνηση αυτού του παίκτη κάτω στη λίστα",
    "admin.hover.competitionPlayers.remove":
      "Αφαίρεση αυτού του παίκτη από το αγώνισμα",
    "admin.hover.competitionPlayers.withdraw":
      "Απόσυρση αυτού του παίκτη από το αγώνισμα",
    "admin.hover.competitionPlayers.unwithdraw":
      "Επαναφορά αυτού του αποσυρμένου παίκτη στο αγώνισμα",
    "admin.hover.competitionPlayers.carryForward":
      "Μεταφορά των αποτελεσμάτων αυτού του παίκτη από άλλο αγώνισμα",
    "admin.hover.notes.add": "Γράψτε μια νέα σημείωση για αυτό το τουρνουά",
    "admin.hover.notes.edit": "Αλλαγή αυτής της σημείωσης",
    "admin.hover.notes.delete": "Διαγραφή αυτής της σημείωσης",
    "admin.hover.note.add":
      "Διατήρηση αυτής της σημείωσης και προσθήκη της στο τουρνουά",
    "admin.hover.note.save": "Διατήρηση των αλλαγών σε αυτή τη σημείωση",
    "admin.hover.people.add": "Να δοθεί ο ρόλος σε αυτό το πρόσωπο",
    "admin.hover.people.remove": "Αφαίρεση του ρόλου από αυτό το πρόσωπο",
    "admin.hover.worldRankings.import":
      "Λήψη των παγκόσμιων κατατάξεων και προσθήκη των παικτών τους",
    "admin.modal.cancel": "Άκυρο",
    // Το μόνο κουμπί ενός παραθύρου διαλόγου που απλώς ενημερώνει τον
    // αναγνώστη.
    "admin.modal.ok": "OK",
    // Οι καρτέλες Υπεύθυνοι και Καταχωρητές, καθεμία από τις οποίες κάνει
    // κάποιον υπεύθυνο ή καταχωρητή με τη διεύθυνση email του και τον
    // αφαιρεί.
    "admin.people.emailAddress": "Διεύθυνση email",
    "admin.people.remove": "Αφαίρεση",
    "admin.people.otherwise": "Αυτό δεν μπόρεσε να γίνει.",
    // Δίπλα στο δικό του όνομα του αναγνώστη ανάμεσα στους υπευθύνους.
    "admin.managers.you": "Εσείς",
    "admin.managers.add": "Προσθήκη υπευθύνου",
    "admin.managers.email": "Email στους υπευθύνους",
    // Δεν λέγεται ποτέ, αφού ένα τουρνουά έχει πάντα υπεύθυνο, αλλά μια λίστα
    // λέει κάτι όταν είναι άδεια.
    "admin.managers.none": "Κανένας υπεύθυνος",
    "admin.managers.removeTitle": "Αφαίρεση υπευθύνου",
    "admin.managers.removeExplanation":
      "{name} δεν θα μπορεί πια να διαχειρίζεται αυτό το τουρνουά.",
    "admin.managers.removeYourself.explanation":
      "Δεν θα μπορείτε πια να διαχειρίζεστε αυτό το τουρνουά και κανείς εδώ δεν μπορεί να το αναιρέσει για εσάς. Ένας άλλος υπεύθυνος μπορεί να σας κάνει ξανά υπεύθυνο.",
    "admin.managers.otherwise":
      "Αυτή η διεύθυνση δεν μπορεί να γίνει υπεύθυνος.",
    // Η καρτέλα Παίκτες.
    // Η καρτέλα Παίκτες ενός αγωνίσματος.
    "admin.competitionPlayers.add": "Προσθήκη παίκτη",
    // Κάτω από την αναπτυσσόμενη λίστα, για μια άρνηση χωρίς δικά της λόγια.
    "admin.competitionPlayers.otherwise":
      "Αυτός ο παίκτης δεν μπορεί να προστεθεί.",
    "admin.competitionPlayers.choose": "Παίκτης προς προσθήκη",
    "admin.competitionPlayers.nobody": "Επιλέξτε παίκτη",
    // Προσφέρεται στην αναπτυσσόμενη λίστα ενός νοκ-άουτ και πώς λέγεται ένα
    // bye στη λίστα.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Κάθε παίκτης συμμετέχει στο αγώνισμα",
    "admin.competitionPlayers.none": "Κανένας παίκτης",
    "admin.competitionPlayers.up": "Πάνω",
    "admin.competitionPlayers.down": "Κάτω",
    "admin.competitionPlayers.remove": "Αφαίρεση",
    "admin.competitionPlayers.withdraw": "Απόσυρση",
    "admin.competitionPlayers.unwithdraw": "Ακύρωση απόσυρσης",
    "admin.competitionPlayers.withdrawn": "Αποσυρμένοι παίκτες",
    "admin.competitionPlayers.removeTitle": "Αφαίρεση παίκτη",
    "admin.competitionPlayers.removeQuestion":
      "{name} θα αφαιρεθεί από το αγώνισμα. Δεν μπορεί να αναιρεθεί.",
    "admin.competitionPlayers.withdrawTitle": "Απόσυρση παίκτη",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} δεν θα παίξει άλλο στο αγώνισμα και τα παιχνίδια που δεν έχουν παιχτεί θα κριθούν χωρίς τη συμμετοχή του παίκτη.",
    "admin.competitionPlayers.carryForward": "Μεταφορά αποτελεσμάτων",
    // Το παράθυρο διαλόγου μεταφοράς αποτελεσμάτων, πάνω από την καρτέλα
    // Παίκτες ενός αγωνίσματος.
    "admin.carryForward.title": "Μεταφορά αποτελεσμάτων - {name}",
    "admin.carryForward.save": "Αποθήκευση",
    // Πάνω από τους αριθμούς, για μια άρνηση χωρίς δικά της λόγια.
    "admin.carryForward.otherwise":
      "Αυτή η μεταφορά αποτελεσμάτων δεν μπορεί να κρατηθεί.",
    "admin.carryForward.matchWins": "Νίκες αγώνων",
    "admin.carryForward.matchLosses": "Ήττες αγώνων",
    "admin.carryForward.gameWins": "Νίκες παιχνιδιών",
    "admin.carryForward.gameLosses": "Ήττες παιχνιδιών",
    "admin.carryForward.hoopsFor": "Τόξα υπέρ",
    "admin.carryForward.hoopsAgainst": "Τόξα κατά",
    "CarryForward.MatchWinsNotWhole":
      "Εισαγάγετε έναν ακέραιο αριθμό νικών αγώνων.",
    "CarryForward.MatchWinsBelowZero":
      "Εισαγάγετε 0 ή περισσότερες νίκες αγώνων.",
    "CarryForward.MatchLossesNotWhole":
      "Εισαγάγετε έναν ακέραιο αριθμό ηττών αγώνων.",
    "CarryForward.MatchLossesBelowZero":
      "Εισαγάγετε 0 ή περισσότερες ήττες αγώνων.",
    "CarryForward.GameWinsNotWhole":
      "Εισαγάγετε έναν ακέραιο αριθμό νικών παιχνιδιών.",
    "CarryForward.GameWinsBelowZero":
      "Εισαγάγετε 0 ή περισσότερες νίκες παιχνιδιών.",
    "CarryForward.GameLossesNotWhole":
      "Εισαγάγετε έναν ακέραιο αριθμό ηττών παιχνιδιών.",
    "CarryForward.GameLossesBelowZero":
      "Εισαγάγετε 0 ή περισσότερες ήττες παιχνιδιών.",
    "CarryForward.HoopsForNotWhole":
      "Εισαγάγετε έναν ακέραιο αριθμό τόξων υπέρ.",
    "CarryForward.HoopsForBelowZero": "Εισαγάγετε 0 ή περισσότερα τόξα υπέρ.",
    "CarryForward.HoopsAgainstNotWhole":
      "Εισαγάγετε έναν ακέραιο αριθμό τόξων κατά.",
    "CarryForward.HoopsAgainstBelowZero":
      "Εισαγάγετε 0 ή περισσότερα τόξα κατά.",
    // Η καρτέλα Αποτελέσματα ενός αγωνίσματος και το παράθυρο του
    // αποτελέσματος.
    "admin.scores.add": "Προσθήκη αποτελέσματος",
    "admin.scores.none": "Κανένα αποτέλεσμα",
    "admin.scores.edit": "Επεξεργασία",
    "admin.scores.drawNotFilledTitle": "Η κλήρωση δεν έχει συμπληρωθεί",
    "admin.scores.archive": "Αρχειοθέτηση",
    "admin.scores.up": "Πάνω",
    "admin.scores.down": "Κάτω",
    "admin.scores.restore": "Επαναφορά",
    "admin.scores.archived": "Αρχειοθετημένα αποτελέσματα",
    "admin.scores.archivedSaid": "Αρχειοθετημένο",
    "admin.scores.withdraw": "Απόσυρση",
    "admin.scores.unwithdraw": "Ακύρωση απόσυρσης",
    "admin.scores.withdrawnSaid": "Αποσυρμένο",
    // Πάνω από τη λίστα, για μια άρνηση χωρίς δικά της λόγια.
    "admin.scores.otherwise": "Αυτό δεν μπόρεσε να γίνει.",
    "admin.score.title": "Προσθήκη αποτελέσματος",
    "admin.score.add": "Προσθήκη παιχνιδιού",
    "admin.score.winner": "Νικητής",
    "admin.score.winnerScore": "Σκορ του νικητή",
    "admin.score.loser": "Ηττημένος",
    "admin.score.loserScore": "Σκορ του ηττημένου",
    "admin.score.beat": "νίκησε",
    "admin.score.added":
      "Το παιχνίδι προστέθηκε: νικητής {winner}, ηττημένος {loser}.",
    "admin.score.otherwise": "Το παιχνίδι δεν μπόρεσε να προστεθεί.",
    "admin.score.playersUnread":
      "Οι παίκτες δεν μπόρεσαν να διαβαστούν. Κλείστε αυτό το παράθυρο και ανοίξτε το ξανά.",
    "admin.score.correctTitle": "Επεξεργασία αποτελέσματος",
    "admin.score.save": "Αποθήκευση",
    "admin.score.notCorrected": "Το αποτέλεσμα δεν μπόρεσε να διορθωθεί.",
    "Game.WinnerMissing": "Επιλέξτε τον νικητή.",
    "Game.WinnerScoreMissing": "Πληκτρολογήστε το σκορ του νικητή.",
    "Game.LoserMissing": "Επιλέξτε τον ηττημένο.",
    "Game.LoserScoreMissing": "Πληκτρολογήστε το σκορ του ηττημένου.",
    "Score.NoPoints": "Ένα σκορ αρχίζει με τον αριθμό των πόντων του.",
    "Game.SamePlayer": "Κανείς δεν παίζει με τον εαυτό του.",
    "Game.WinnerNotAhead":
      "Το σκορ του νικητή πρέπει να είναι μεγαλύτερο από του ηττημένου ή να σημαίνεται ως νίκη.",
    "Game.LoserMarked": "Το σκορ του ηττημένου δεν μπορεί να σημανθεί ως νίκη.",
    "Game.ResultChanged":
      "Μια διόρθωση κρατά το αποτέλεσμα: ένα παιχνίδι που κερδήθηκε μένει κερδισμένο και ένα ισόπαλο μένει ισόπαλο.",
    "Competition.MatchDecided": "Ο αγώνας τους έχει ήδη κριθεί.",
    "Competition.DrawFull":
      "Δεν μπορεί να προστεθεί ο παίκτης επειδή το νοκ-άουτ είναι γεμάτο.",
    "Competition.DrawNotFilled":
      "Δεν μπορούν να προστεθούν αποτελέσματα μέχρι να συμπληρωθεί κάθε θέση του νοκ-άουτ με έναν παίκτη ή ένα bye.",
    "Competition.ByeOutsideKnockout": "Μόνο ένα νοκ-άουτ μπορεί να έχει bye.",
    "Competition.NotDrawnToMeet":
      "Αυτοί οι παίκτες δεν έχουν κληρωθεί προς το παρόν να παίξουν μεταξύ τους στο νοκ-άουτ.",
    "Competition.WinnerHasPlayedOn":
      "Ο νικητής αυτού του αγώνα έχει ήδη παίξει το επόμενο παιχνίδι του, γι' αυτό το ποιος τον κέρδισε δεν μπορεί να αλλάξει.",
    "CompetitionPlayer.Withdrawn": "Ένας αποσυρμένος παίκτης δεν παίζει άλλο.",
    "admin.players.add": "Προσθήκη παίκτη",
    "admin.players.addMany": "Προσθήκη παικτών",
    "admin.players.none": "Κανένας παίκτης",
    "admin.players.edit": "Επεξεργασία",
    "admin.players.archive": "Αρχειοθέτηση",
    "admin.players.restore": "Επαναφορά",
    "admin.players.up": "Πάνω",
    "admin.players.down": "Κάτω",
    // Ερωτάται πριν από την αρχειοθέτηση ενός παίκτη που συμμετέχει σε
    // αγωνίσματα, αφού η αρχειοθέτηση τον αφαιρεί από καθένα και η επαναφορά
    // δεν τον βάζει ξανά.
    "admin.players.archiveTitle": "Αρχειοθέτηση παίκτη",
    "admin.players.archiveQuestion":
      "{name} θα αφαιρεθεί από αυτά τα αγωνίσματα:",
    "admin.players.archive.explanation":
      "Η επαναφορά του δεν θα τον βάλει ξανά σε αυτά τα αγωνίσματα.",
    "admin.players.archived": "Αρχειοθετημένοι παίκτες",
    // Λέγεται σε αναγνώστη οθόνης, αφού μια γραμμή πάνω από ένα όνομα δεν
    // διαβάζεται φωναχτά.
    "admin.players.archivedSaid": "Αρχειοθετημένος",
    // Το παράθυρο του παίκτη.
    "admin.player.addTitle": "Προσθήκη παίκτη",
    "admin.player.editTitle": "Επεξεργασία παίκτη",
    "admin.player.name": "Όνομα",
    "admin.player.handicap": "Χάντικαπ",
    "admin.player.representing": "Εκπροσωπεί",
    "admin.player.worldRankingName": "Όνομα παίκτη στην παγκόσμια κατάταξη",
    // Δίπλα στο όνομα της παγκόσμιας κατάταξης: αν το γνωρίζουν οι παγκόσμιες
    // κατατάξεις.
    "admin.player.worldRankingKnown":
      "Οι παγκόσμιες κατατάξεις γνωρίζουν αυτό το όνομα.",
    "admin.player.worldRankingQuestioned":
      "Οι παγκόσμιες κατατάξεις δεν έχουν παίκτη με αυτό το όνομα. Μπορεί να είναι γραμμένο λάθος ή ο παίκτης να είναι καινούργιος στις κατατάξεις.",
    "admin.player.flag": "Σημαία",
    "admin.player.add": "Προσθήκη",
    "admin.player.save": "Αποθήκευση",
    "admin.player.added": "{name} προστέθηκε.",
    // Το παράθυρο των παικτών (players.feature): αρκετοί παίκτες γραμμένοι σε
    // ένα πλαίσιο.
    "admin.players.addManyTitle": "Προσθήκη παικτών",
    // Ένας σύνδεσμος στη γραμμή τίτλου ενός παραθύρου, προς τη βοήθεια που το
    // εξηγεί.
    "admin.dialog.help": "Βοήθεια",
    "admin.players.many": "Παίκτες",
    "admin.players.line": "Γραμμή {line}: {words}",
    "AddPlayers.FieldsMissing":
      "Γράψτε τα ονόματα των πεδίων στην πρώτη γραμμή.",
    "AddPlayers.FirstRowNotFields":
      "Η πρώτη γραμμή πρέπει να έχει ονόματα πεδίων, δείτε το {help} για περισσότερες πληροφορίες.",
    "AddPlayers.NameMissing": "Τα πεδία πρέπει να περιλαμβάνουν το Name.",
    "AddPlayers.FieldNotAllowed":
      "Ένα πεδίο μπορεί να είναι Name, Representing, Flag, Handicap ή WorldRankingPlayerName.",
    "AddPlayers.FieldRepeated": "Ένα πεδίο μπορεί να ονομαστεί μόνο μία φορά.",
    "AddPlayers.PlayersMissing":
      "Γράψτε έναν παίκτη σε κάθε γραμμή μετά την πρώτη.",
    "AddPlayers.TooManyPlayers":
      "Μια λίστα μπορεί να έχει το πολύ 500 παίκτες. Προσθέστε τους υπόλοιπους σε άλλη λίστα.",
    "AddPlayers.ValuesMismatched":
      "Κάθε παίκτης χρειάζεται μια τιμή, ή τίποτα, για κάθε πεδίο που ονομάζεται στην πρώτη γραμμή.",
    // Πάνω από τα πεδία, για μια άρνηση χωρίς δικά της λόγια.
    "admin.player.otherwise": "Αυτός ο παίκτης δεν μπορεί να κρατηθεί ως έχει.",
    "Tournament.PlayerNameTaken":
      "Ένας άλλος παίκτης σε αυτό το τουρνουά έχει ήδη αυτό το όνομα.",
    "TournamentPlayer.NoSuchFlag": "Επιλέξτε μία από τις σημαίες που υπάρχουν.",
    "TournamentPlayer.HandicapMalformed":
      "Γράψτε το χάντικαπ ως αριθμό. Για παράδειγμα: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "Ένας παίκτης δεν μπορεί να λέγεται Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Ένα όνομα χρειάζεται ένα γράμμα ή ένα ψηφίο.",
    // Το παράθυρο πάνω από το παράθυρο του παίκτη όταν ένας παίκτης
    // ονομάζεται bye.
    "admin.player.byesTitle": "Τα bye δεν χρειάζονται προσθήκη",
    "admin.player.byes":
      "Ένα bye δεν είναι ένας από τους παίκτες του τουρνουά. Ένα νοκ-άουτ προσφέρει το Bye κάθε φορά που προστίθενται οι παίκτες του, όσες φορές χρειάζεται η κλήρωσή του.",
    // Ένα τουρνουά που παίζεται από ομάδες (view.feature): οι καρτέλες
    // Ομάδες και Τεστ, η σελίδα μιας ομάδας και τα παράθυρά τους.
    "admin.view.teams": "Ομάδες",
    "admin.view.tests": "Τεστ",
    "admin.teams.add": "Προσθήκη ομάδας",
    "admin.teams.none": "Καμία ομάδα",
    "admin.teams.edit": "Επεξεργασία",
    "admin.teams.view": "Προβολή",
    "admin.teams.archive": "Αρχειοθέτηση",
    "admin.teams.restore": "Επαναφορά",
    "admin.teams.up": "Πάνω",
    "admin.teams.down": "Κάτω",
    "admin.teams.archived": "Αρχειοθετημένες ομάδες",
    "admin.teams.archivedSaid": "Αρχειοθετημένη",
    "admin.team.addTitle": "Προσθήκη ομάδας",
    "admin.team.editTitle": "Επεξεργασία ομάδας",
    "admin.team.name": "Όνομα",
    "admin.team.shortName": "Σύντομο όνομα",
    "admin.team.shortName.explanation":
      "Με ποιο όνομα λέγονται τα τεστ της ομάδας, όπως AUS v ENG.",
    "admin.team.flag": "Σημαία",
    "admin.team.add": "Προσθήκη",
    "admin.team.save": "Αποθήκευση",
    "admin.team.added": "Η ομάδα {name} προστέθηκε.",
    // Πάνω από τα πεδία, για μια άρνηση χωρίς δικά της λόγια.
    "admin.team.otherwise": "Αυτή η ομάδα δεν μπορεί να κρατηθεί ως έχει.",
    "admin.teamView.otherwise": "Αυτή η ομάδα δεν μπορεί να προβληθεί από εδώ.",
    "admin.teamView.players": "Παίκτες",
    "TeamName.Missing": "Πείτε πώς λέγεται η ομάδα.",
    "TeamName.TooLong": "Αυτό το όνομα είναι πολύ μεγάλο.",
    "admin.notes.add": "Προσθήκη σημείωσης",
    "admin.notes.none": "Καμία σημείωση",
    "admin.notes.edit": "Επεξεργασία",
    "admin.notes.delete": "Διαγραφή",
    // Ερωτάται πριν από τη διαγραφή μιας σημείωσης, αφού μια σημείωση που
    // διαγράφηκε χάνεται για πάντα.
    "admin.notes.deleteTitle": "Διαγραφή σημείωσης",
    "admin.notes.deleteQuestion": "Να διαγραφεί η σημείωση «{title}»;",
    "admin.notes.delete.explanation":
      "Μια σημείωση που διαγράφηκε χάνεται για πάντα και δεν μπορεί να επανέλθει.",
    // Πάνω από τη λίστα, για μια άρνηση χωρίς δικά της λόγια.
    "admin.notes.otherwise": "Αυτό δεν μπόρεσε να γίνει.",
    // Το παράθυρο της σημείωσης, οι καρτέλες της περιγραφής του και η γραμμή
    // εργαλείων πάνω από το πλαίσιό του.
    "admin.note.addTitle": "Προσθήκη σημείωσης",
    "admin.note.editTitle": "Επεξεργασία σημείωσης",
    "admin.note.title": "Τίτλος",
    "admin.note.description": "Περιγραφή",
    "admin.note.write": "Γραφή",
    "admin.note.preview": "Προεπισκόπηση",
    "admin.note.toolbar": "Μορφοποίηση",
    "admin.note.tool.heading": "Επικεφαλίδα",
    "admin.note.tool.bold": "Έντονα",
    "admin.note.tool.italic": "Πλάγια",
    "admin.note.tool.quote": "Παράθεση",
    "admin.note.tool.code": "Κώδικας",
    "admin.note.tool.link": "Σύνδεσμος",
    "admin.note.tool.numberedList": "Αριθμημένη λίστα",
    "admin.note.tool.bulletedList": "Λίστα με κουκκίδες",
    "admin.note.tool.taskList": "Λίστα εργασιών",
    "admin.note.add": "Προσθήκη",
    "admin.note.save": "Αποθήκευση",
    // Πάνω από τα πεδία, για μια άρνηση χωρίς δικά της λόγια.
    "admin.note.otherwise": "Αυτή η σημείωση δεν μπορεί να κρατηθεί ως έχει.",
    "ManagerNoteTitle.Missing": "Δώστε έναν τίτλο στη σημείωση.",
    "ManagerNoteTitle.TooLong": "Αυτός ο τίτλος είναι πολύ μεγάλος.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Ένας τίτλος χρειάζεται ένα γράμμα ή ένα ψηφίο.",
    "ManagerNoteDescription.TooLong": "Αυτή η περιγραφή είναι πολύ μεγάλη.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Αυτή η σημείωση δεν υπάρχει πια. Ίσως την έχει διαγράψει άλλος υπεύθυνος.",
    "EditManagerNote.NoSuchManagerNote":
      "Αυτή η σημείωση δεν υπάρχει πια. Ίσως την έχει διαγράψει άλλος υπεύθυνος.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Αυτή η σημείωση δεν υπάρχει πια. Ίσως την έχει διαγράψει άλλος υπεύθυνος.",
    "ManagerNote.Deleted":
      "Αυτή η σημείωση έχει διαγραφεί. Ίσως την έχει διαγράψει άλλος υπεύθυνος.",
    "CommentaryTitle.Missing": "Δώστε έναν τίτλο στον σχολιασμό.",
    "CommentaryTitle.TooLong": "Αυτός ο τίτλος είναι πολύ μεγάλος.",
    "CommentaryTitle.NoLetterOrDigit":
      "Ένας τίτλος χρειάζεται ένα γράμμα ή ένα ψηφίο.",
    "Commentary.TitleTaken": "Ένας άλλος σχολιασμός έχει ήδη αυτόν τον τίτλο.",
    "CommentText.Missing": "Γράψτε κάτι στο σχόλιο.",
    "CommentText.TooLong": "Αυτό το σχόλιο είναι πολύ μεγάλο.",
    "TeamShortName.Missing": "Δώστε στην ομάδα ένα σύντομο όνομα.",
    "TeamShortName.TooLong":
      "Ένα σύντομο όνομα μπορεί να έχει το πολύ 10 χαρακτήρες.",
    "TeamShortName.NoLetterOrDigit":
      "Ένα σύντομο όνομα χρειάζεται ένα γράμμα ή ένα ψηφίο.",
    "Team.ShortNameLongerThanName":
      "Ένα σύντομο όνομα δεν μπορεί να είναι μεγαλύτερο από το όνομα της ομάδας.",
    "Team.NoSuchFlag": "Επιλέξτε μία από τις σημαίες που υπάρχουν.",
    "Team.Archived":
      "Αυτή η ομάδα είναι αρχειοθετημένη και επαναφέρεται πρώτα.",
    "Team.InATest":
      "Αυτή η ομάδα παίζει σε τεστ και δεν μπορεί να αρχειοθετηθεί.",
    "Team.PlayerNameTaken":
      "Ένας άλλος παίκτης σε αυτή την ομάδα έχει ήδη αυτό το όνομα.",
    "TeamPlayer.NamedBye": "Ένας παίκτης δεν μπορεί να λέγεται Bye.",
    "TeamPlayer.Archived":
      "Αυτός ο παίκτης είναι αρχειοθετημένος και επαναφέρεται πρώτα.",
    "TeamPlayer.HasGames":
      "Αυτός ο παίκτης έχει παίξει και δεν μπορεί να αρχειοθετηθεί.",
    "Tournament.TeamNameTaken":
      "Μια άλλη ομάδα σε αυτό το τουρνουά έχει ήδη αυτό το όνομα.",
    "Tournament.TeamShortNameTaken":
      "Μια άλλη ομάδα σε αυτό το τουρνουά έχει ήδη αυτό το σύντομο όνομα.",
    "Tournament.NoSuchTeam":
      "Αυτό το τουρνουά δεν έχει ομάδα σε αυτή τη διεύθυνση.",
    "Tournament.TeamArchived":
      "Αυτή η ομάδα είναι αρχειοθετημένη και μπορεί να επαναφερθεί μόνο από την καρτέλα Ομάδες.",
    "admin.tests.add": "Προσθήκη τεστ",
    "admin.tests.none": "Κανένα τεστ",
    "admin.tests.edit": "Επεξεργασία",
    "admin.tests.view": "Προβολή",
    "admin.tests.archive": "Αρχειοθέτηση",
    "admin.tests.restore": "Επαναφορά",
    "admin.tests.up": "Πάνω",
    "admin.tests.down": "Κάτω",
    "admin.tests.archived": "Αρχειοθετημένα τεστ",
    "admin.tests.twoTeamsNeeded":
      "Ένα τεστ είναι ανάμεσα σε δύο ομάδες, γι' αυτό χρειάζονται πρώτα δύο ομάδες.",
    "admin.tests.toTeams": "Μετάβαση στις Ομάδες",
    "admin.tests.matches.one": "{count} αγώνας",
    "admin.tests.matches.other": "{count} αγώνες",
    "admin.tests.bestOf": "καλύτερος από {games}",
    // Δίπλα στη λίστα, για μια άρνηση χωρίς δικά της λόγια.
    "admin.tests.otherwise": "Αυτό δεν μπόρεσε να γίνει.",
    "admin.test.addTitle": "Προσθήκη τεστ",
    "admin.test.editTitle": "Επεξεργασία τεστ",
    "admin.test.firstTeam": "Ομάδα Α",
    "admin.test.secondTeam": "Ομάδα Β",
    "admin.test.versus": "v",
    "admin.test.starts": "Έναρξη",
    "admin.test.finishes": "Λήξη",
    "admin.test.expectedMatches": "Αναμενόμενοι αγώνες",
    "admin.test.bestOf": "Καλύτερος από",
    "admin.test.group": "Όμιλος",
    "admin.test.add": "Προσθήκη",
    "admin.test.save": "Αποθήκευση",
    "admin.test.added": "Το τεστ {name} προστέθηκε.",
    "admin.test.otherwise": "Αυτό το τεστ δεν μπορεί να κρατηθεί ως έχει.",
    "admin.testView.otherwise": "Αυτό το τεστ δεν μπορεί να προβληθεί από εδώ.",
    "AddTest.FirstTeamMissing": "Επιλέξτε την πρώτη ομάδα.",
    "AddTest.SecondTeamMissing": "Επιλέξτε τη δεύτερη ομάδα.",
    "UpdateTest.FirstTeamMissing": "Επιλέξτε την πρώτη ομάδα.",
    "UpdateTest.SecondTeamMissing": "Επιλέξτε τη δεύτερη ομάδα.",
    "ExpectedMatches.NotWhole": "Εισαγάγετε έναν ακέραιο αριθμό αγώνων.",
    "ExpectedMatches.TooSmall":
      "Ένα τεστ πρέπει να αναμένεται να έχει τουλάχιστον 1 αγώνα.",
    "TestGroup.TooLong": "Αυτός ο όμιλος είναι πολύ μεγάλος.",
    "Tournament.TestAgainstItself":
      "Μια ομάδα δεν παίζει τεστ εναντίον του εαυτού της.",
    "Tournament.FormatHasNoGroups":
      "Ένα τεστ σε αυτή τη μορφή δεν μπαίνει σε όμιλο.",
    "Tournament.TestFinishesBeforeStarts":
      "Ένα τεστ δεν μπορεί να λήξει πριν από την έναρξή του.",
    "Tournament.TestStartsBeforeTournament":
      "Ένα τεστ δεν μπορεί να ξεκινήσει πριν από το τουρνουά του.",
    "Tournament.TestFinishesAfterTournament":
      "Ένα τεστ δεν μπορεί να λήξει μετά το τουρνουά του.",
    "Tournament.TestHasGamesInUse":
      "Αυτό το τεστ έχει παιχνίδια, γι' αυτό δεν μπορεί να αρχειοθετηθεί μέχρι να αρχειοθετηθούν εκείνα.",
    "Tournament.TestHasGames":
      "Αυτό το τεστ έχει πλέον παιχνίδια, γι' αυτό οι ομάδες του δεν μπορούν πια να αλλάξουν.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Έχουν ήδη ξεκινήσει περισσότεροι αγώνες από αυτόν τον αριθμό.",
    "Tournament.BestOfBelowGamesPlayed":
      "Δύο παίκτες έχουν ήδη παίξει περισσότερα παιχνίδια από αυτόν τον αριθμό.",
    "Competition.ExpectedMatchesReached":
      "Αυτό το τεστ έχει ξεκινήσει όσους αγώνες αναμένεται να έχει.",
    "Competition.SameTeam":
      "Δύο παίκτες της ίδιας ομάδας δεν παίζουν μεταξύ τους.",
    "AddManager.NoSuchAccount":
      "Αυτή η διεύθυνση δεν έχει λογαριασμό που να μπορεί να γίνει υπεύθυνος.",
    "admin.scorers.add": "Προσθήκη καταχωρητή",
    "admin.scorers.none": "Κανένας καταχωρητής",
    "admin.scorers.removeTitle": "Αφαίρεση καταχωρητή",
    "admin.scorers.removeExplanation":
      "{name} δεν θα μπορεί πια να καταχωρίζει τα αποτελέσματα αυτού του τουρνουά.",
    // Κάτω από το πεδίο, για μια άρνηση χωρίς δικά της λόγια.
    "admin.scorers.otherwise":
      "Αυτή η διεύθυνση δεν μπορεί να γίνει καταχωρητής.",
    "AddScorer.NoSuchAccount":
      "Αυτή η διεύθυνση δεν έχει λογαριασμό που να μπορεί να γίνει καταχωρητής.",
    // Η απόδοση, η αφαίρεση και η καταγραφή ρόλων, που μπορεί να κάνει μόνο ένας
    // διαχειριστής.
    "Account.NotAnAdministrator":
      "Μόνο ένας διαχειριστής μπορεί να το κάνει αυτό.",
    "AddRole.NoSuchAccount":
      "Αυτή η διεύθυνση δεν έχει λογαριασμό στον οποίο μπορεί να δοθεί ο ρόλος.",
    "AddRole.NoSuchRole": "Δεν υπάρχει τέτοιος ρόλος.",
    "RemoveRole.NoSuchAccount": "Δεν υπάρχει τέτοιος λογαριασμός.",
    "RemoveRole.NoSuchRole": "Δεν υπάρχει τέτοιος ρόλος.",
    "RemoveRole.Yourself":
      "Δεν μπορείτε να αφαιρέσετε από τον εαυτό σας τον ρόλο του διαχειριστή.",
    "AccountsWithRole.NoSuchRole": "Δεν υπάρχει τέτοιος ρόλος.",
    "Tournament.AlreadyAManager":
      "Αυτός ο λογαριασμός διαχειρίζεται ήδη το τουρνουά και μπορεί να κάνει ό,τι μπορεί ένας καταχωρητής.",

    // Οι αρνήσεις ενός τουρνουά, με κλειδί τους κωδικούς τους όπως κάθε
    // κανόνας που παραβιάστηκε. Κάτω από το πεδίο στο οποίο αναφέρεται καθεμία
    // ή στη θέση της φόρμας όταν απορρίπτεται η ίδια η σελίδα.
    "TournamentName.Missing": "Πείτε πώς λέγεται το τουρνουά.",
    "TournamentName.TooShort": "Αυτό το όνομα είναι πολύ σύντομο.",
    "TournamentName.TooLong": "Αυτό το όνομα είναι πολύ μεγάλο.",
    "TournamentName.AllLowerCase": "Ένα όνομα δεν μπορεί να είναι όλο με πεζά.",
    "TournamentName.AllCapitals":
      "Ένα όνομα δεν μπορεί να είναι όλο με κεφαλαία.",
    "TournamentName.NoLetterOrDigit":
      "Ένα όνομα χρειάζεται ένα γράμμα ή ένα ψηφίο.",
    "ReadOnlyDate.Unreadable": "Δώστε την ημέρα.",
    "Tournament.FinishesBeforeStarts":
      "Ένα τουρνουά δεν μπορεί να λήξει πριν από την έναρξή του.",
    "Tournament.StartsAfterNextYear":
      "Ένα τουρνουά δεν μπορεί να ξεκινήσει μετά το επόμενο έτος.",
    "Tournament.FinishesAfterNextYear":
      "Ένα τουρνουά δεν μπορεί να λήξει μετά το επόμενο έτος.",
    "CreateTournament.NoSuchCountry": "Επιλέξτε τη χώρα.",
    "TournamentSubtitle.TooLong":
      "Ένας υπότιτλος δεν μπορεί να είναι μεγαλύτερος από 2000 χαρακτήρες.",
    "Tournament.NotAManager":
      "Μόνο ένας υπεύθυνος αυτού του τουρνουά μπορεί να το αλλάξει.",
    "Tournament.NotAManagerOrScorer":
      "Μόνο ένας υπεύθυνος ή καταχωρητής αυτού του τουρνουά μπορεί να το δει.",
    "Tournament.Archived":
      "Αυτό το τουρνουά είναι αρχειοθετημένο και επαναφέρεται πριν μπορέσει να αλλάξει.",
    "UpdateTournament.NoSuchTournament":
      "Δεν υπάρχει τουρνουά σε αυτή τη διεύθυνση.",

    // Σε τι παίζεται ένα τουρνουά και πού, ανά κωδικό, όπως τα προσφέρει το API
    // στη φόρμα της διαχείρισης.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "Αμερικανικό 6 τόξων",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "Ομάδες",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship":
      "Παγκόσμιο πρωτάθλημα ομάδων Golf Croquet",
    "country.ad": "Ανδόρα",
    "country.ae": "Ηνωμένα Αραβικά Εμιράτα",
    "country.af": "Αφγανιστάν",
    "country.ag": "Αντίγκουα και Μπαρμπούντα",
    "country.ai": "Ανγκουίλα",
    "country.al": "Αλβανία",
    "country.am": "Αρμενία",
    "country.ao": "Αγκόλα",
    "country.ar": "Αργεντινή",
    "country.as": "Αμερικανική Σαμόα",
    "country.at": "Αυστρία",
    "country.au": "Αυστραλία",
    "country.aw": "Αρούμπα",
    "country.ax": "Νήσοι Όλαντ",
    "country.az": "Αζερμπαϊτζάν",
    "country.ba": "Βοσνία και Ερζεγοβίνη",
    "country.bb": "Μπαρμπέιντος",
    "country.bd": "Μπανγκλαντές",
    "country.be": "Βέλγιο",
    "country.bf": "Μπουρκίνα Φάσο",
    "country.bg": "Βουλγαρία",
    "country.bh": "Μπαχρέιν",
    "country.bi": "Μπουρούντι",
    "country.bj": "Μπενίν",
    "country.bm": "Βερμούδες",
    "country.bn": "Μπρουνέι",
    "country.bo": "Βολιβία",
    "country.br": "Βραζιλία",
    "country.bs": "Μπαχάμες",
    "country.bt": "Μπουτάν",
    "country.bv": "Νήσος Μπουβέ",
    "country.bw": "Μποτσουάνα",
    "country.by": "Λευκορωσία",
    "country.bz": "Μπελίζ",
    "country.ca": "Καναδάς",
    "country.catalonia": "Καταλονία",
    "country.cc": "Νήσοι Κόκος (Κίλινγκ)",
    "country.cd": "Λαϊκή Δημοκρατία του Κονγκό",
    "country.cf": "Κεντροαφρικανική Δημοκρατία",
    "country.cg": "Δημοκρατία του Κονγκό",
    "country.ch": "Ελβετία",
    "country.ci": "Ακτή Ελεφαντοστού",
    "country.ck": "Νήσοι Κουκ",
    "country.cl": "Χιλή",
    "country.cm": "Καμερούν",
    "country.cn": "Κίνα",
    "country.co": "Κολομβία",
    "country.cr": "Κόστα Ρίκα",
    "country.cu": "Κούβα",
    "country.cv": "Πράσινο Ακρωτήριο",
    "country.cx": "Νήσος των Χριστουγέννων",
    "country.cy": "Κύπρος",
    "country.cz": "Τσεχία",
    "country.de": "Γερμανία",
    "country.dj": "Τζιμπουτί",
    "country.dk": "Δανία",
    "country.dm": "Ντομίνικα",
    "country.do": "Δομινικανή Δημοκρατία",
    "country.dz": "Αλγερία",
    "country.ec": "Ισημερινός",
    "country.ee": "Εσθονία",
    "country.eg": "Αίγυπτος",
    "country.eh": "Δυτική Σαχάρα",
    "country.england": "Αγγλία",
    "country.er": "Ερυθραία",
    "country.es": "Ισπανία",
    "country.et": "Αιθιοπία",
    "country.fi": "Φινλανδία",
    "country.fj": "Φίτζι",
    "country.fk": "Νήσοι Φόκλαντ",
    "country.fm": "Μικρονησία",
    "country.fo": "Νήσοι Φερόες",
    "country.fr": "Γαλλία",
    "country.ga": "Γκαμπόν",
    "country.gb": "Ηνωμένο Βασίλειο",
    "country.gd": "Γρενάδα",
    "country.ge": "Γεωργία",
    "country.gf": "Γαλλική Γουιάνα",
    "country.gh": "Γκάνα",
    "country.gi": "Γιβραλτάρ",
    "country.gl": "Γροιλανδία",
    "country.gm": "Γκάμπια",
    "country.gn": "Γουινέα",
    "country.gp": "Γουαδελούπη",
    "country.gq": "Ισημερινή Γουινέα",
    "country.gr": "Ελλάδα",
    "country.gs": "Νότια Γεωργία και Νότιες Νήσοι Σάντουιτς",
    "country.gt": "Γουατεμάλα",
    "country.gu": "Γκουάμ",
    "country.gw": "Γουινέα Μπισάου",
    "country.gy": "Γουιάνα",
    "country.hk": "Χονγκ Κονγκ",
    "country.hm": "Νήσοι Χερντ και Μακντόναλντ",
    "country.hn": "Ονδούρα",
    "country.hr": "Κροατία",
    "country.ht": "Αϊτή",
    "country.hu": "Ουγγαρία",
    "country.id": "Ινδονησία",
    "country.ie": "Ιρλανδία",
    "country.il": "Ισραήλ",
    "country.im": "Νήσος του Μαν",
    "country.in": "Ινδία",
    "country.io": "Βρετανικά Εδάφη Ινδικού Ωκεανού",
    "country.iq": "Ιράκ",
    "country.ir": "Ιράν",
    "country.is": "Ισλανδία",
    "country.it": "Ιταλία",
    "country.je": "Τζέρζι",
    "country.jm": "Τζαμάικα",
    "country.jo": "Ιορδανία",
    "country.jp": "Ιαπωνία",
    "country.ke": "Κένυα",
    "country.kg": "Κιργιστάν",
    "country.kh": "Καμπότζη",
    "country.ki": "Κιριμπάτι",
    "country.km": "Κομόρες",
    "country.kn": "Σεν Κιτς και Νέβις",
    "country.kp": "Βόρεια Κορέα",
    "country.kr": "Νότια Κορέα",
    "country.kw": "Κουβέιτ",
    "country.ky": "Νήσοι Κέιμαν",
    "country.kz": "Καζακστάν",
    "country.la": "Λάος",
    "country.lb": "Λίβανος",
    "country.lc": "Αγία Λουκία",
    "country.li": "Λιχτενστάιν",
    "country.lk": "Σρι Λάνκα",
    "country.lr": "Λιβερία",
    "country.ls": "Λεσότο",
    "country.lt": "Λιθουανία",
    "country.lu": "Λουξεμβούργο",
    "country.lv": "Λετονία",
    "country.ly": "Λιβύη",
    "country.ma": "Μαρόκο",
    "country.mc": "Μονακό",
    "country.md": "Μολδαβία",
    "country.me": "Μαυροβούνιο",
    "country.mg": "Μαδαγασκάρη",
    "country.mh": "Νήσοι Μάρσαλ",
    "country.mk": "Βόρεια Μακεδονία",
    "country.ml": "Μάλι",
    "country.mm": "Μιανμάρ",
    "country.mn": "Μογγολία",
    "country.mo": "Μακάο",
    "country.mp": "Νήσοι Βόρειες Μαριάνες",
    "country.mq": "Μαρτινίκα",
    "country.mr": "Μαυριτανία",
    "country.ms": "Μονσεράτ",
    "country.mt": "Μάλτα",
    "country.mu": "Μαυρίκιος",
    "country.mv": "Μαλδίβες",
    "country.mw": "Μαλάουι",
    "country.mx": "Μεξικό",
    "country.my": "Μαλαισία",
    "country.mz": "Μοζαμβίκη",
    "country.na": "Ναμίμπια",
    "country.nc": "Νέα Καληδονία",
    "country.ne": "Νίγηρας",
    "country.nf": "Νήσος Νόρφολκ",
    "country.ng": "Νιγηρία",
    "country.ni": "Νικαράγουα",
    "country.nl": "Κάτω Χώρες",
    "country.no": "Νορβηγία",
    "country.np": "Νεπάλ",
    "country.nr": "Ναουρού",
    "country.nu": "Νιούε",
    "country.nz": "Νέα Ζηλανδία",
    "country.om": "Ομάν",
    "country.pa": "Παναμάς",
    "country.pe": "Περού",
    "country.pf": "Γαλλική Πολυνησία",
    "country.pg": "Παπούα Νέα Γουινέα",
    "country.ph": "Φιλιππίνες",
    "country.pk": "Πακιστάν",
    "country.pl": "Πολωνία",
    "country.pm": "Σεν Πιερ και Μικελόν",
    "country.pn": "Νήσοι Πίτκερν",
    "country.pr": "Πουέρτο Ρίκο",
    "country.ps": "Παλαιστίνη",
    "country.pt": "Πορτογαλία",
    "country.pw": "Παλάου",
    "country.py": "Παραγουάη",
    "country.qa": "Κατάρ",
    "country.re": "Ρεϊνιόν",
    "country.ro": "Ρουμανία",
    "country.rs": "Σερβία",
    "country.ru": "Ρωσία",
    "country.rw": "Ρουάντα",
    "country.sa": "Σαουδική Αραβία",
    "country.sb": "Νήσοι Σολομώντος",
    "country.sc": "Σεϋχέλλες",
    "country.scotland": "Σκωτία",
    "country.sd": "Σουδάν",
    "country.se": "Σουηδία",
    "country.sg": "Σιγκαπούρη",
    "country.sh": "Αγία Ελένη",
    "country.si": "Σλοβενία",
    "country.sj": "Σβάλμπαρντ και Γιαν Μαγιέν",
    "country.sk": "Σλοβακία",
    "country.sl": "Σιέρα Λεόνε",
    "country.sm": "Άγιος Μαρίνος",
    "country.sn": "Σενεγάλη",
    "country.so": "Σομαλία",
    "country.sr": "Σουρινάμ",
    "country.st": "Σάο Τομέ και Πρίνσιπε",
    "country.sv": "Ελ Σαλβαδόρ",
    "country.sy": "Συρία",
    "country.sz": "Εσουατίνι",
    "country.tc": "Νήσοι Τερκς και Κάικος",
    "country.td": "Τσαντ",
    "country.tf": "Γαλλικά Νότια Εδάφη",
    "country.tg": "Τόγκο",
    "country.th": "Ταϊλάνδη",
    "country.tj": "Τατζικιστάν",
    "country.tk": "Τοκελάου",
    "country.tl": "Τιμόρ-Λέστε",
    "country.tm": "Τουρκμενιστάν",
    "country.tn": "Τυνησία",
    "country.to": "Τόνγκα",
    "country.tr": "Τουρκία",
    "country.tt": "Τρινιντάντ και Τομπάγκο",
    "country.tv": "Τουβαλού",
    "country.tw": "Ταϊβάν",
    "country.tz": "Τανζανία",
    "country.ua": "Ουκρανία",
    "country.ug": "Ουγκάντα",
    "country.um": "Απομακρυσμένες Νησίδες των ΗΠΑ",
    "country.us": "Ηνωμένες Πολιτείες",
    "country.uy": "Ουρουγουάη",
    "country.uz": "Ουζμπεκιστάν",
    "country.va": "Βατικανό",
    "country.vc": "Άγιος Βικέντιος και Γρεναδίνες",
    "country.ve": "Βενεζουέλα",
    "country.vg": "Βρετανικές Παρθένες Νήσοι",
    "country.vi": "Αμερικανικές Παρθένες Νήσοι",
    "country.vn": "Βιετνάμ",
    "country.vu": "Βανουάτου",
    "country.wales": "Ουαλία",
    "country.wf": "Γουάλις και Φουτούνα",
    "country.ws": "Σαμόα",
    "country.ye": "Υεμένη",
    "country.yt": "Μαγιότ",
    "country.za": "Νότια Αφρική",
    "country.zm": "Ζάμπια",
    "country.zw": "Ζιμπάμπουε",

    // Ένα email είναι δύο εγγραφές: το θέμα του, που είναι κείμενο, και το σώμα
    // του, που είναι ολόκληρη η σήμανσή του. Είναι το μόνο μέρος όπου ένας
    // κατάλογος κρατά σήμανση, και την κρατά επειδή ένα email γράφεται και
    // μεταφράζεται ως κείμενο και όχι ως λίστα φράσεων που κάποιος άλλος βάζει
    // σε σειρά: όποιος γράφει ένα βλέπει ό,τι θα δει ο παραλήπτης του. Μόνο ό,τι
    // συμπληρώνει ένα email διαφεύγει, γι' αυτό τίποτα που δίνεται σε ένα δεν
    // μπορεί να γίνει σήμανση· η σήμανση εδώ είναι της ίδιας της ιστοσελίδας.
    // Το `{link}` είναι ο σύνδεσμος που φέρει το email, το `{site}` η διεύθυνση
    // της ιστοσελίδας, για έναν σύνδεσμο σε μια δική της σελίδα, τα
    // `{buttonBackgroundColour}` και `{buttonTextColour}` τα χρώματα ενός
    // κουμπιού, το `{emailFromName}` το όνομα από το οποίο στέλνονται τα email
    // της ιστοσελίδας, με το οποίο υπογράφεται το καθένα, και το `{siteName}`
    // πώς λέγεται η ιστοσελίδα, ίδιο με αυτό που τη λένε οι σελίδες της. Τα
    // τελευταία τέσσερα είναι της ίδιας της ιστοσελίδας και τα συμπληρώνει ο
    // συντάκτης, ποτέ ό,τι έβαλε το email στην ουρά. Ένα κουμπί χρωματίζεται
    // εκεί που βρίσκεται, επειδή ένα πρόγραμμα αλληλογραφίας δεν διαβάζει
    // φύλλο στυλ. Κανένα δεν χαιρετά τον παραλήπτη του με το όνομά του, ώστε
    // τίποτα για ένα πρόσωπο εκτός από τη διεύθυνση προς την οποία πηγαίνει
    // ένα email να μη χρειάζεται να μπει στην ουρά.

    "Email.ConfirmAddress.subject":
      "Επιβεβαιώστε τη διεύθυνση email σας για το {siteName}",
    "Email.ConfirmAddress.body": `
<p>Γεια σας,</p>

<p>
    Ευχαριστούμε που δημιουργήσατε λογαριασμό στο <strong>{siteName}</strong>.<br />
    Προτού μπορέσετε να αρχίσετε να χρησιμοποιείτε τον λογαριασμό σας,
    επιβεβαιώστε τη διεύθυνση email σας πατώντας το παρακάτω κουμπί:
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
        Επιβεβαίωση της διεύθυνσης email μου
    </a>
</p>

<p>
    Αν το κουμπί δεν λειτουργεί, μπορείτε επίσης να επιβεβαιώσετε τη διεύθυνση email σας ανοίγοντας αυτόν τον σύνδεσμο στον περιηγητή σας:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Αν δεν δημιουργήσατε εσείς αυτόν τον λογαριασμό, μπορείτε να αγνοήσετε με ασφάλεια αυτό το email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Νέος σύνδεσμος για την επιβεβαίωση της διεύθυνσης email σας για το {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Γεια σας,</p>

<p>
    Ζητήσατε πρόσφατα ένα νέο email για την επιβεβαίωση της διεύθυνσης email σας για το <strong>{siteName}</strong>.<br />
    Επιβεβαιώστε τη διεύθυνση email σας πατώντας το παρακάτω κουμπί:
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
        Επιβεβαίωση της διεύθυνσης email μου
    </a>
</p>

<p>
    Αν το κουμπί δεν λειτουργεί, μπορείτε επίσης να επιβεβαιώσετε τη διεύθυνση email σας ανοίγοντας αυτόν τον σύνδεσμο στον περιηγητή σας:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Μόλις επιβεβαιωθεί, θα μπορείτε να συνεχίσετε να χρησιμοποιείτε τον λογαριασμό σας χωρίς διακοπή.
</p>

<p>
    Αν δεν ζητήσατε εσείς αυτό το email, μπορείτε να το αγνοήσετε με ασφάλεια.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Κάποιος προσπάθησε να εγγραφεί με τη διεύθυνση email σας",
    "Email.AlreadyRegistered.body": `
<p>Γεια σας,</p>

<p>
    Κάποιος προσπάθησε να εγγραφεί στο <strong>{siteName}</strong> με αυτή τη
    διεύθυνση email, η οποία έχει ήδη λογαριασμό. Τίποτα στον λογαριασμό σας
    δεν έχει αλλάξει.<br />
    Αν ήσασταν εσείς, έχετε ήδη λογαριασμό και μπορείτε να συνδεθείτε σε αυτόν:
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
        Σύνδεση
    </a>
</p>

<p>
    Αν έχετε ξεχάσει τον κωδικό σας, μπορείτε να τον επαναφέρετε εδώ:
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
        Ξέχασα τον κωδικό
    </a>
</p>

<p>
    Αν δεν ήσασταν εσείς, δεν χρειάζεται να κάνετε τίποτα. Κανείς δεν έχει
    αποκτήσει πρόσβαση στον λογαριασμό σας.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Επιβεβαιώστε τη μεταφορά του λογαριασμού σας στο {siteName} σε αυτή τη διεύθυνση",
    "Email.ConfirmNewEmailAddress.body": `
<p>Γεια σας,</p>

<p>
    Κάποιος που ήταν συνδεδεμένος σε έναν λογαριασμό του <strong>{siteName}</strong> ζήτησε να τον μεταφέρει
    σε αυτή τη διεύθυνση email. Αν ήσασταν εσείς, επιβεβαιώστε το εδώ,
    συνδεδεμένοι σε εκείνον τον λογαριασμό. Ο σύνδεσμος ισχύει για 24 ώρες.
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
        Μεταφορά του λογαριασμού μου
    </a>
</p>

<p>
    Ή αντιγράψτε αυτή τη διεύθυνση στον περιηγητή σας:<br />
    {link}
</p>

<p>
    Αν δεν ήσασταν εσείς, δεν χρειάζεται να κάνετε τίποτα. Κανένας λογαριασμός δεν θα μεταφερθεί εδώ.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Κάποιος ζήτησε να μεταφερθεί ένας λογαριασμός στη διεύθυνση email σας",
    "Email.AlreadyHasAnAccount.body": `
<p>Γεια σας,</p>

<p>
    Κάποιος που ήταν συνδεδεμένος σε έναν λογαριασμό του <strong>{siteName}</strong> ζήτησε να τον μεταφέρει
    σε αυτή τη διεύθυνση email, η οποία έχει ήδη δικό της λογαριασμό. Τίποτα
    δεν μεταφέρθηκε και τίποτα στον λογαριασμό σας δεν έχει αλλάξει.
</p>

<p>
    Αν ήσασταν εσείς, έχετε ήδη λογαριασμό σε αυτή τη διεύθυνση και μπορείτε
    να συνδεθείτε σε αυτόν.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Ο λογαριασμός σας στο {siteName} μεταφέρθηκε",
    "Email.EmailAddressChanged.body": `
<p>Γεια σας,</p>

<p>
    Ο λογαριασμός σας στο <strong>{siteName}</strong> μόλις μεταφέρθηκε σε άλλη
    διεύθυνση email, την {emailAddress}, και από εδώ και πέρα συνδέεται με
    αυτή τη διεύθυνση.
</p>

<p>
    Αν δεν ήσασταν εσείς, κάποιος άλλος έχει τον λογαριασμό σας. Απαντήστε σε
    αυτό το email και πείτε μας.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Ο κωδικός σας στο {siteName} άλλαξε",
    "Email.PasswordChanged.body": `
<p>Γεια σας,</p>

<p>
    Ο κωδικός του λογαριασμού σας στο <strong>{siteName}</strong> μόλις
    άλλαξε και κάθε άλλος περιηγητής που ήταν συνδεδεμένος σε αυτόν
    αποσυνδέθηκε.<br />
    Αν ήσασταν εσείς, δεν χρειάζεται να κάνετε τίποτα.
</p>

<p>
    Αν δεν ήσασταν εσείς, κάποιος άλλος έχει τον κωδικό σας. Ορίστε νέον εδώ και
    θα αποσυνδεθεί:
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
        Ξέχασα τον κωδικό
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Ορίστε νέο κωδικό για το {siteName}",
    "Email.SetNewPassword.body": `
<p>Γεια σας,</p>

<p>
    Ζητήσατε πρόσφατα να επαναφέρετε τον κωδικό σας για το <strong>{siteName}</strong>.<br />
    Μπορείτε να επαναφέρετε τον κωδικό σας πατώντας το παρακάτω κουμπί:
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
        Επαναφορά κωδικού
    </a>
</p>

<p>
    Αν το κουμπί δεν λειτουργεί, μπορείτε επίσης να επαναφέρετε τον κωδικό σας ανοίγοντας αυτόν τον σύνδεσμο στον περιηγητή σας:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Αν δεν ζητήσατε επαναφορά κωδικού, μπορείτε να αγνοήσετε με ασφάλεια αυτό το email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Ορίστε έναν κωδικό για το {siteName}",
    "Email.SetPassword.body": `
<p>Γεια σας,</p>

<p>
    Ο λογαριασμός σας στο <strong>{siteName}</strong> δεν έχει κωδικό: συνδέεστε με τη Google.<br />
    Ζητήσατε να ορίσετε έναν, ώστε να μπορείτε να συνδέεστε και με τη διεύθυνση email και έναν κωδικό.
    Μπορείτε να τον ορίσετε πατώντας το παρακάτω κουμπί:
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
        Ορισμός κωδικού
    </a>
</p>

<p>
    Αν το κουμπί δεν λειτουργεί, μπορείτε επίσης να ορίσετε τον κωδικό σας ανοίγοντας αυτόν τον σύνδεσμο στον περιηγητή σας:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ο σύνδεσμος ισχύει για μία ώρα. Αν δεν ζητήσατε να ορίσετε κωδικό, μπορείτε να αγνοήσετε με ασφάλεια αυτό το email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Δεν υπάρχει λογαριασμός στο {siteName} για αυτή τη διεύθυνση email",
    "Email.RegisterInstead.body": `
<p>Γεια σας,</p>

<p>
    Έγινε αίτημα επαναφοράς του κωδικού για μια διεύθυνση email που δεν
    σχετίζεται με λογαριασμό στο <strong>{siteName}</strong>.
</p>

<p>
    Αν θέλετε να χρησιμοποιήσετε την υπηρεσία μας, μπορείτε να δημιουργήσετε νέο λογαριασμό επισκεπτόμενοι:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Αν δεν κάνατε εσείς αυτό το αίτημα, μπορείτε να αγνοήσετε με ασφάλεια αυτό το email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Επιβεβαιώστε ότι ο λογαριασμός σας στο {siteName} πρόκειται να ξεχαστεί",
    "Email.ConfirmForgetting.body": `
<p>Γεια σας,</p>

<p>
    Ζητήσατε να ξεχαστεί ο λογαριασμός σας στο <strong>{siteName}</strong>.<br />
    Πατήστε το παρακάτω κουμπί για να δείτε τι σημαίνει αυτό και για να
    δηλώσετε με βεβαιότητα ότι το θέλετε:
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
        Λήθη του λογαριασμού μου
    </a>
</p>

<p>
    Αν το κουμπί δεν λειτουργεί, μπορείτε επίσης να ανοίξετε αυτόν τον σύνδεσμο στον περιηγητή σας:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Μόλις ξεχαστεί, το όνομα και η διεύθυνση email σας δεν θα μπορούν ποτέ
    ξανά να διαβαστούν, από κανέναν, και δεν θα μπορείτε να συνδεθείτε στον
    λογαριασμό σας. Δεν μπορεί να αναιρεθεί.
</p>

<p>
    Ο σύνδεσμος λειτουργεί μία φορά, μέχρι 15 λεπτά αφότου τον ζητήσατε, και
    μόνο όσο είστε συνδεδεμένοι σε αυτόν τον λογαριασμό. Μετά από αυτό, ζητήστε
    ξανά από τον λογαριασμό σας.
</p>

<p>
    Αν δεν το ζητήσατε εσείς, τίποτα δεν θα συμβεί εφόσον δεν ακολουθηθεί ο
    σύνδεσμος. Κάποιος όμως που ήταν συνδεδεμένος στον λογαριασμό σας το
    ζήτησε, γι' αυτό ορίστε νέο κωδικό από τη σελίδα «Ξέχασα τον κωδικό» για
    να βεβαιωθείτε ότι δεν μπορεί να συνδεθεί ξανά.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Οι εγγραφές έχουν ανασταλεί: δεν υπάρχει πρόσβαση στο {service}",
    "Email.RegistrationsSuspended.body": `
<p>Γεια σας,</p>

<p>
    Το {siteName} δεν μπόρεσε να φτάσει στο {service} στις {when}. Μέχρι να
    απαντήσει, οι αναγνώστες που το χρειάζονται, για να εγγραφούν ή να ορίσουν
    νέο κωδικό, ενημερώνονται να δοκιμάσουν ξανά αργότερα.
</p>

<p>
    Δεν χρειάζεται να αρθεί τίποτα. Κάθε προσπάθεια ρωτά το {service} από την
    αρχή και οι σελίδες λειτουργούν ξανά τη στιγμή που απαντά.
</p>

<p>
    Όσο το {service} παραμένει εκτός λειτουργίας, θα λαμβάνετε email γι' αυτό
    το πολύ μία φορά την ώρα.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "Το {siteName} δεν μπορεί να φτάσει στη βάση δεδομένων του",
    "Email.DatabaseUnreachable.body": `
<p>Γεια σας,</p>

<p>
    Το {siteName} δεν μπόρεσε να φτάσει στη βάση δεδομένων του στις {when}. Μέχρι να απαντήσει, κάθε σελίδα που τη χρειάζεται λέει στους αναγνώστες ότι η ιστοσελίδα δεν είναι διαθέσιμη και να δοκιμάσουν ξανά αργότερα.
</p>

<p>
    Δεν χρειάζεται να αρθεί τίποτα. Κάθε αίτημα ζητά σύνδεση από την αρχή και η ιστοσελίδα λειτουργεί ξανά τη στιγμή που απαντά η βάση δεδομένων.
</p>

<p>
    Όσο η βάση δεδομένων παραμένει εκτός λειτουργίας, θα λαμβάνετε email γι' αυτό το πολύ μία φορά κάθε {minutes} λεπτά.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "Το {siteName} απέτυχε σε ένα αίτημα",
    "Email.UnhandledError.body": `
<p>Γεια σας,</p>

<p>
    Το {siteName} απέτυχε στις {when} σε ένα αίτημα για {asked}. Στον αναγνώστη εμφανίστηκε η αναφορά {reference} και το αρχείο καταγραφής έχει από κάτω την αιτία.
</p>

<p>
    Μια ιστοσελίδα που είναι χαλασμένη τείνει να αποτυγχάνει σε κάθε αίτημα, γι' αυτό θα λαμβάνετε email για αποτυχίες το πολύ 4 φορές την ώρα. Οι επόμενες υπάρχουν πάντως στο αρχείο καταγραφής.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
