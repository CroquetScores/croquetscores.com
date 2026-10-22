# Passwords

## What the site asks of a password

Wherever you choose a password, when you confirm your email address, set a new password or change one, the site asks that it:

- is **at least 12 characters** long;
- is typed twice the same, the second time as **Confirm password**;
- is not one that has **appeared in a data breach** somewhere else.

Spaces at the start and end are dropped, as they are when you sign in, so a stray space does not lock you out. Spaces in the middle are kept, which suits a passphrase of several words.

## Choosing a good one

The site asks for length and for nothing else, not capital letters, digits or symbols. That follows current advice, which is that a long password, never used anywhere else, is stronger and easier to remember than a short one made hard to read. The advice the site follows is the US National Institute of Standards and Technology's, which you can read at [NIST's digital identity guidelines, on passwords](https://pages.nist.gov/800-63-4/sp800-63b.html).

In short:

- **Make it long.** Several unrelated words make a passphrase that is easy to remember and hard to guess.
- **Use it here and nowhere else.** A password used on two sites is only as safe as the weaker of them, and passwords stolen from one are tried on others.
- **Keep it in a password manager** if you can, which can make a long password for every site and remember them all.
- **Do not change it on a timetable.** Change it when you think somebody else may know it, and not otherwise.

## How the site checks for a breached password

Lists of passwords stolen from other sites are published, and people trying to get into accounts try them first. So when you choose a password, the site asks an outside service whether it is on such a list. The service is run by a third party, and the site uses it only for this.

Your password does not leave the site. The site makes a one-way fingerprint of it, which cannot be turned back into the password, and sends the service only the first five characters of that fingerprint. The service answers with the rest of the fingerprint of every breached password that begins the same way, which is several hundred of them, and the site looks for its own among them. So the service learns that your password is one of several hundred, and never which. [How this works, explained by Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/), says more.

A password that is on the list is refused with a message saying so, and you choose another. If the service cannot be reached, your password cannot be checked just now, so it is not accepted or changed. Try again in a few minutes. A link you were sent still works until it expires.

## Changing your password

Choose **Change Password** in the **Account** menu. The page asks for your **Current password**, a **New password**, and it again as **Confirm password**. The current one is asked for because being signed in is not enough: a phone left unlocked would otherwise let whoever picked it up lock you out.

Once it is changed you stay signed in on this browser and every other is signed out. The site emails your address to say the password was changed, so that if it was not you, you find out. A wrong current password counts towards the same limits that signing in has.

If you do not remember the current password, the page points to **Forgot Password?**.

Next: [Looking after your account](looking-after-your-account.md).
