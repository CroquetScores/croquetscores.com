// Sending an email by handing it to a mail server over SMTP, which is how the
// old site sent its email too, through Brevo's relay. It is what stands in for
// FileEmailSender wherever the email is to leave the machine.
import { createTransport, type Transporter } from "nodemailer";

import type {
  EmailSender,
  OutgoingEmail,
} from "../../application/services/EmailSender.js";

export interface SmtpSettings {
  readonly host: string;
  readonly port: number;
  readonly userName: string;
  readonly password: string;
  /**
   * A certificate to trust in addition to the ones everybody does. Only a
   * server with a certificate of its own making needs one, which is the
   * scenarios' and nothing the site is deployed with.
   */
  readonly certificateAuthority?: string;
}

// The standard port for a connection that is encrypted from its first byte.
// Every other port begins in the clear and is then asked to encrypt, which is
// what 587, the port Brevo's relay is used on, does.
const IMPLICIT_TLS_PORT = 465;

export class SmtpEmailSender implements EmailSender {
  private readonly transport: Transporter;

  constructor(private readonly settings: SmtpSettings) {
    this.transport = createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.port === IMPLICIT_TLS_PORT,
      // Required rather than tried: left to its default, a server that offers
      // no encryption is signed in to in the clear, and the password and every
      // link that signs a reader in go over the network readable.
      requireTLS: true,
      auth: { user: settings.userName, pass: settings.password },
      ...(settings.certificateAuthority === undefined
        ? {}
        : { tls: { ca: settings.certificateAuthority } }),
    });
  }

  // The moment is left unused, as the interface allows: the server stamps the email when it takes it, and
  // a second stamp from here would be one the reader could see disagree.
  async send(email: OutgoingEmail): Promise<void> {
    try {
      await this.transport.sendMail({
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: email.body,
      });
    } catch (error) {
      const said = error instanceof Error ? error.message : String(error);
      // Thrown with the server's own words, so whoever reads the log can see
      // why; the password is taken out in case a server repeats what it was
      // given.
      throw new Error(
        `Sending the email failed: ${said.split(this.settings.password).join("***")}`,
        { cause: error },
      );
    }
  }
}
