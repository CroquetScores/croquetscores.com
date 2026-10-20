import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { EmailsWritten, WrittenTo } from "../../services/EmailsWritten.js";
import { ReportUnreachableService } from "./ReportUnreachableService.js";
import { AN_HOUR, shiftedBy } from "../../common/moments.js";

/**
 * Telling the administrator a service the site needs cannot be reached, at
 * most once an hour for each service.
 *
 * Counted where every email is counted, and with the administrator held for
 * that service until this transaction ends, so that readers turned away at
 * the same moment tell the administrator once between them.
 */
export class ReportUnreachableServiceHandler extends CommandHandler<
  ReportUnreachableService,
  void
> {
  readonly handles: RequestType<ReportUnreachableService> =
    ReportUnreachableService;

  /**
   * @param administrator who is told.
   */
  constructor(
    private readonly queue: EmailQueue,
    private readonly written: EmailsWritten,
    private readonly administrator: string,
  ) {
    super();
  }

  async handle(command: ReportUnreachableService): Promise<void> {
    const whom: WrittenTo = { administratorAbout: command.service };
    const since = shiftedBy(command.requestedAt, -AN_HOUR);
    if ((await this.written.countSince(whom, since)) > 0) return;

    await this.queue.queue({
      kind: "Email.RegistrationsSuspended",
      to: this.administrator,
      // The site's own language: the administrator reads what the site is
      // written in, not whatever the reader who was turned away asked for.
      language: "en",
      website: command.website,
      fill: {
        service: command.service,
        when: command.requestedAt.toDate().toISOString(),
      },
      queuedAt: command.requestedAt,
    });
    await this.written.record(
      whom,
      "Email.RegistrationsSuspended",
      command.requestedAt,
    );
  }
}
