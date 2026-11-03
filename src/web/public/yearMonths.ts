// The months of a year's page, and of a sport's in a year: twelve closed
// months, and the way to load one month's tournaments alone when it is
// pressed (yearMonths.feature).
//
// A year holds hundreds of tournaments and a reader is after a month's, so the
// page does not list them. Loading a year whole on every visit would ask the
// database for a great deal nobody reads, and cutting it into pages would only
// spread the same question over several visits. So a month is fetched when it
// is pressed, as the table alone, and put under the month without the page
// being loaded again. That needs scripting; without it the page says so and
// lists no month, rather than listing months that lead nowhere.
//
// The months are in a template and put on the page by the script that follows
// it, so that a browser without scripting has none to show.
import type { FastifyReply, FastifyRequest } from "fastify";

import { TournamentsInYear } from "../../application/operations/tournaments/TournamentsInYear.js";
import type { Assets } from "../common/assets.js";
import { escape } from "../common/escape.js";
import type { Speaking } from "../common/language.js";
import { websiteOf } from "../common/site.js";
import {
  askedOf,
  asAPage,
  refusedWith,
  sendPage,
  settledWhenPressed,
  table,
  type Asked,
} from "./tournamentLists.js";

// A year is four digits, the first not a nought, as it is in a tournament's
// address (TournamentAddress.ts), since no tournament can start in any other.
// Anything else is left to whatever else the address could be, and is not
// found where it is nothing. "0000" in particular is no year Postgres has, and
// asking it for the days of one would fail rather than find none.
export const yearInPath = ":year(^[1-9]\\d{3}$)";

// A month is two digits, "01" to "12".
export const monthInPath = ":month(^(0[1-9]|1[0-2])$)";

const twoDigits = (month: number): string => String(month).padStart(2, "0");

// The month's name, in the reader's language and as that language writes it
// on its own, which is how a list of them is read.
const monthName = (language: string, year: number, month: number): string =>
  new Intl.DateTimeFormat(language, { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );

// What presses on a month, and what sorts the months' tables, do not load the
// page. A press on a row beyond its link follows the name's link, as the rows
// of every other table do (tournamentLists.ts), since a script put in by
// innerHTML is not run and so the table's own cannot do it.
const script = `
    <script>
      (function () {
        var root = document.currentScript.parentElement;
        root.appendChild(root.querySelector("template").content.cloneNode(true));
        // How the tables are sorted, which is the page's and not a month's: a
        // month sorted sorts every other open month the same way, and one
        // opened afterwards begins sorted so too.
        var sorting = null;
        // "keep" is what tells the server the reader pressed a column, to be
        // remembered by their device (rememberedSorting.ts), and "forget" that
        // they put the usual order back, as opposed to a month opened with the
        // sorting it already had.
        function searchFor(pressed) {
          var query = new URLSearchParams(window.location.search);
          if (sorting !== null) query.set("tournaments", sorting);
          if (pressed === "keep") query.set("keep", "tournaments");
          if (pressed === "forget") {
            query.delete("tournaments");
            query.set("forget", "tournaments");
          }
          var written = query.toString();
          return written === "" ? "" : "?" + written;
        }
        function show(month, open) {
          month.querySelector(".year-month-body").hidden = !open;
          month.dataset.state = open ? "open" : "closed";
          var toggle = month.querySelector(".year-month-toggle");
          toggle.setAttribute("aria-expanded", String(open));
          toggle.querySelector(".year-month-mark").textContent = open ? "-" : "+";
        }
        function load(month, pressed) {
          var body = month.querySelector(".year-month-body");
          var search = searchFor(pressed);
          month.setAttribute("aria-busy", "true");
          // Only the newest asking for a month is kept: a sorting pressed twice
          // sends two, and the older answer may arrive after the newer.
          var ticket = String(Number(month.dataset.ticket || 0) + 1);
          month.dataset.ticket = ticket;
          var current = function () { return month.dataset.ticket === ticket; };
          fetch(root.dataset.base + "/months/" + month.dataset.month + search, {
            credentials: "same-origin",
          })
            .then(function (answer) {
              // A filter the server refuses is answered with the reason, which
              // is shown in the month, and anything else that is not the table
              // is a failure to load it.
              if (!answer.ok && answer.status !== 422) {
                throw new Error(String(answer.status));
              }
              return answer.text().then(function (html) {
                if (!current()) return;
                body.innerHTML = html;
                body.hidden = false;
                if (!answer.ok) {
                  month.dataset.state = "failed";
                  return;
                }
                Array.prototype.forEach.call(
                  body.querySelectorAll(".tournament-list"),
                  function (list) { list.classList.add("tournament-list-pressable"); }
                );
                month.dataset.loaded = searchFor(null);
                show(month, true);
              });
            })
            .catch(function () {
              if (!current()) return;
              body.textContent = root.dataset.failed;
              body.hidden = false;
              month.dataset.state = "failed";
            })
            .then(function () { if (current()) month.removeAttribute("aria-busy"); });
        }
        root.addEventListener("click", function (event) {
          var toggle = event.target.closest(".year-month-toggle");
          if (toggle !== null) {
            var month = toggle.closest(".year-month");
            if (month.dataset.state === "open") {
              show(month, false);
            } else if (month.dataset.loaded === searchFor(null)) {
              show(month, true);
            } else {
              load(month, null);
            }
            return;
          }
          var sort = event.target.closest(".year-month-body thead a");
          if (sort !== null) {
            event.preventDefault();
            sorting = new URLSearchParams(sort.search).get("tournaments");
            Array.prototype.forEach.call(
              root.querySelectorAll('.year-month[data-state="open"]'),
              function (open) { load(open, "keep"); }
            );
            return;
          }
          var usual = event.target.closest(".year-month-body .tournament-list-usual a");
          if (usual !== null) {
            event.preventDefault();
            sorting = null;
            Array.prototype.forEach.call(
              root.querySelectorAll('.year-month[data-state="open"]'),
              function (open) { load(open, "forget"); }
            );
            return;
          }
          var row = event.target.closest(".year-month-body tbody tr");
          if (row === null || event.target.closest("a") !== null) return;
          if (String(window.getSelection()) !== "") return;
          var link = row.querySelector(".tournament-name");
          if (link !== null) link.click();
        });
      })();
    </script>`;

/**
 * The twelve months of `year`, closed, under the page's own address `base`
 * ("/2026" or "/2026/ac"), which is also where a month's tournaments are
 * fetched from.
 */
export const monthsOf = (
  speaking: Speaking,
  year: number,
  base: string,
): string => {
  const { say } = speaking;
  const months = Array.from({ length: 12 }, (_, at) => at + 1)
    .map(
      (
        month,
      ) => `          <li class="year-month" data-month="${twoDigits(month)}" data-state="closed">
            <button type="button" class="year-month-toggle" id="month-toggle-${twoDigits(month)}" aria-expanded="false"><span class="year-month-mark" aria-hidden="true">+</span> <span class="year-month-name">${escape(monthName(speaking.language.tag, year, month))}</span></button>
            <div class="year-month-body" hidden></div>
          </li>`,
    )
    .join("\n");
  return `        <section class="year-months" data-base="${escape(base)}" data-failed="${escape(say("year.monthFailed"))}">
          <noscript><p class="notice">${escape(say("year.needsScripting"))}</p></noscript>
          <template>
            <ol class="year-month-list">
${months}
            </ol>
          </template>${script}
        </section>`;
};

/** Where a month's tournaments are fetched from, under a page at `base`. */
export const monthPath = (base: string): string =>
  `${base}/months/${monthInPath}`;

// A month's table as a page of its own would draw it, and nothing round it.
// The links in it are the page's, so that a flag leads to the page narrowed to
// its country; only sorting stays in the month, by the script above.
export const sendMonth = async (
  request: FastifyRequest<{ Params: { year: string; month: string } }>,
  reply: FastifyReply,
  assets: Assets,
  speaking: Speaking,
  page: { path: string; sport?: { code: string; name: string } },
): Promise<FastifyReply> => {
  const { say } = speaking;
  const pageKey = page.sport === undefined ? "year" : "sport";
  const pressed = settledWhenPressed(request, reply, pageKey, ["tournaments"], {
    offersSport: page.sport === undefined,
  });
  if (pressed !== undefined) return pressed;
  const year = Number(request.params.year);
  const month = Number(request.params.month);
  const asked: Asked = askedOf(request, page.path, pageKey, ["tournaments"], {
    offersSport: page.sport === undefined,
  });
  const chose =
    page.sport === undefined
      ? asked.chose
      : { ...asked.chose, sport: page.sport.code };
  const named = {
    month: monthName(speaking.language.tag, year, month),
    year: request.params.year,
    sport: page.sport?.name ?? "",
  };
  try {
    const listed = await request.server.mediator.query(
      new TournamentsInYear(websiteOf(request).host, year, chose, month),
    );
    return sendPage(
      reply,
      request,
      table(
        {
          table: "tournaments",
          // Named by the month's own button, which is its heading, so that a
          // month is not headed twice.
          namedBy: `month-toggle-${twoDigits(month)}`,
          heading: "",
          none: say(
            page.sport === undefined ? "year.monthNone" : "yearSport.monthNone",
            named,
          ),
          listed,
          sortedAtFirst: { column: "date", order: "up" },
        },
        asked,
        speaking,
        assets,
      ),
    );
  } catch (failure) {
    const code = refusedWith(failure);
    if (code === undefined) throw failure;
    request.log.info({ code }, "Request refused");
    return asAPage(reply.code(422))
      .type("text/html; charset=utf-8")
      .send(
        `<p class="page-refused" data-refused="${escape(code)}">${escape(say("errors.refusedDetail"))}</p>`,
      );
  }
};
