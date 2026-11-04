// The panel at the top of the first page of the help, in which a reader types
// a question and is shown the pages that answer it (helpSearch.feature).
//
// It works without scripting: the form is sent to the help itself, which
// answers with the page and the results in it. With scripting the results
// appear beneath the field as the typing pauses, asked of the same search the
// form uses, so the two cannot give different answers.
import { escape } from "../common/escape.js";
import type { HelpAnswer } from "../common/helpSearch.js";
import { helpSearchField, longestQuestion } from "../common/helpSearch.js";
import type { Speaking } from "../common/language.js";

/** What the page shows beneath the field. */
export type HelpSearched =
  | { readonly kind: "not asked" }
  | { readonly kind: "answered"; readonly answers: readonly HelpAnswer[] }
  | { readonly kind: "too long" };

const resultMarkup = (answer: HelpAnswer): string =>
  `<li><a href="${escape(answer.url)}"><span class="help-search-result-title">${escape(answer.title)}</span><span class="help-search-snippet">${answer.snippet}</span></a></li>`;

// Written beside the panel and not in a file of its own, as the header's
// scripts are (layout.ts): there is nothing to fetch, and the panel works the
// moment it is shown. The words it needs are on the panel's own attributes, so
// that they are the catalogue's and not written here a second time.
const script = `          <script>
            (function () {
              var panel = document.currentScript.parentElement;
              var form = panel.querySelector("form");
              var field = form.querySelector("input");
              var results = panel.querySelector(".help-search-results");
              var note = panel.querySelector(".help-search-note");
              var timer;
              var latest = 0;
              var show = function (items) {
                results.textContent = "";
                note.textContent = "";
                if (items.length === 0) note.textContent = panel.dataset.none;
                items.forEach(function (item) {
                  var li = document.createElement("li");
                  var link = document.createElement("a");
                  var title = document.createElement("span");
                  var snippet = document.createElement("span");
                  link.href = item.url;
                  title.className = "help-search-result-title";
                  title.textContent = item.title;
                  snippet.className = "help-search-snippet";
                  // Escaped by the site, with the matching words in <mark>.
                  snippet.innerHTML = item.snippet;
                  link.appendChild(title);
                  link.appendChild(snippet);
                  li.appendChild(link);
                  results.appendChild(li);
                });
              };
              var ask = function () {
                var typed = field.value.trim();
                var mine = ++latest;
                if (typed === "") {
                  show([]);
                  note.textContent = "";
                  return;
                }
                fetch("/api/site/help/search", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ query: typed }),
                }).then(function (response) {
                  if (!response.ok) throw new Error();
                  return response.json();
                }).then(function (body) {
                  if (mine === latest) show(body.results);
                }).catch(function () {
                  if (mine !== latest) return;
                  results.textContent = "";
                  note.textContent = panel.dataset.failed;
                });
              };
              field.addEventListener("input", function () {
                clearTimeout(timer);
                timer = setTimeout(ask, 300);
              });
              form.addEventListener("submit", function (event) {
                event.preventDefault();
                clearTimeout(timer);
                ask();
              });
            })();
          </script>
`;

export const helpSearchPanel = (
  speaking: Speaking,
  siteName: string,
  asked: string,
  searched: HelpSearched,
): string => {
  const title = speaking.say("helpSearch.title", { siteName });
  const note =
    searched.kind === "too long"
      ? speaking.say("helpSearch.tooLong", { most: String(longestQuestion) })
      : searched.kind === "answered" && searched.answers.length === 0
        ? speaking.say("helpSearch.none")
        : "";
  const answers = searched.kind === "answered" ? searched.answers : [];
  return `          <section class="help-search" aria-labelledby="help-search-title" data-none="${escape(speaking.say("helpSearch.none"))}" data-failed="${escape(speaking.say("helpSearch.failed"))}">
            <p class="help-search-title" id="help-search-title">${escape(title)}</p>
            <form method="get" action="/help" role="search">
              <input id="help-search-field" name="${helpSearchField}" type="search" aria-label="${escape(speaking.say("helpSearch.label"))}" maxlength="${longestQuestion}" autocomplete="off" value="${escape(asked)}" />
              <button type="submit">${escape(speaking.say("helpSearch.submit"))}</button>
            </form>
            <p class="help-search-note" role="status">${escape(note)}</p>
            <ol class="help-search-results">${answers.map(resultMarkup).join("")}</ol>
${script}          </section>
`;
};
