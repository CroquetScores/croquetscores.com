import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { EmailsWritten, WrittenTo } from "../../services/EmailsWritten.js";
import { ReportUnreachableService } from "./ReportUnreachableService.js";

const AN_HOUR = 60 * 60 * 1000;

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
   * @param administrator who is told, or nothing where the site has nobody to
   *   tell — a development machine, say — and so tells nobody.
   */
  constructor(
    private readonly queue: EmailQueue,
    private readonly written: EmailsWritten,
    private readonly administrator: string | undefined,
  ) {
    super();
  }

  async handle(command: ReportUnreachableService): Promise<void> {
    if (this.administrator === undefined) return;

    const whom: WrittenTo = { administratorAbout: command.service };
    const since = ReadOnlyDate.from(
      new Date(command.requestedAt.toDate().getTime() - AN_HOUR),
    );
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
