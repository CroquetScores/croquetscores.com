// What lets a reader put the site on their phone's home screen: the manifest a
// browser reads to learn what the site is called, where it starts, how it looks
// and which pictures stand for it, the links to it and to the website's
// pictures that go into every page's head, and the button in the footer that
// offers to install the site (webAppManifest.feature).
//
// The manifest is for one website, read from the address a request was reached
// at, so it is not one of the site's files under the assets path: those are the
// same for every website and kept for a year, and this is neither.
//
// The links are put into each page as it is sent, where the head closes, as the
// preview's are (pagePreview.ts), rather than drawn by each page as it is
// rendered: the pages are drawn by the public layout, by the admin's built file
// and by the error and maintenance pages, and a link every one of them had to
// remember is one the next of them forgets.
//
// A try website has none of it: what is entered there may be removed at any
// time, and an icon that looks like the real website on a reader's home screen
// would hold nothing that lasts. It still names a picture for a browser's tab,
// which offers nothing.
import type { FastifyInstance, FastifyReply } from "fastify";

import type { Site } from "../../domain/common/Website.js";
import type { Assets } from "./assets.js";
import { escape } from "./escape.js";
import type { Speaking } from "./language.js";
import { varyByHost } from "./searchEngines.js";
import { siteNameOf, websiteOf } from "./site.js";

/** Where the manifest is asked for. */
export const manifestPath = "/manifest.webmanifest";

// The folder of `assets/app-icons` each site's pictures are in.
const iconFolders: Readonly<Record<Site, string>> = {
  croquetScores: "croquet-scores",
  gateballScores: "gateball-scores",
};

// The colours of the bars and of the page behind the panel, as the stylesheet
// says them for light and for dark (site.css, the block of tokens). A manifest
// has no way to say one thing for light and another for dark, so it says the
// light ones, which are the site's own; a page says the dark one for itself.
// Written here and not read from the stylesheet, which a server has no reason
// to parse, so the scenarios hold the two together by reading both.
const barsInLight = "#398639";
const barsInDark = "#20201f";
const pageInLight = "#e6f2e6";

const aDay = 60 * 60 * 24;

const pictureOf = (assets: Assets, site: Site, file: string): string =>
  assets.url(`app-icons/${iconFolders[site]}/${file}`);

const manifestOf = (
  assets: Assets,
  site: Site,
  name: string,
): Record<string, unknown> => ({
  // The home page's address and not wherever the app starts, so that a later
  // change of where it starts does not make a browser take the site for a
  // second app and leave a reader with two icons.
  id: "/",
  name,
  short_name: name,
  start_url: "/",
  scope: "/",
  display: "standalone",
  theme_color: barsInLight,
  background_color: pageInLight,
  icons: [
    {
      src: pictureOf(assets, site, "android-icon-192x192.png"),
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: pictureOf(assets, site, "android-icon-512x512.png"),
      sizes: "512x512",
      type: "image/png",
    },
  ],
});

const headEnd = "</head>";

// The API answers in JSON and is no page to put a link in, whatever it may
// quote. Everything else that answers as HTML is a page, an error's included:
// a reader sent to one is as likely to want the right tab picture.
const isTheApi = (path: string): boolean => /^\/api(\/|$)/.test(path);

export const registerWebAppManifest = (
  server: FastifyInstance,
  assets: Assets,
): void => {
  server.get(manifestPath, (request, reply: FastifyReply) => {
    const website = websiteOf(request);
    if (website.isTry) return reply.callNotFound();
    varyByHost(reply);
    return (
      reply
        // The same for every reader of a website, and as unchanging as its
        // name, so anybody may keep it. A day is long enough to spare the
        // site the asking and short enough for a change to reach a phone.
        .header("cache-control", `public, max-age=${String(aDay)}`)
        .type("application/manifest+json; charset=utf-8")
        .send(
          JSON.stringify(manifestOf(assets, website.site, siteNameOf(request))),
        )
    );
  });

  server.addHook("onSend", (request, reply, payload, done) => {
    const path = request.url.split("?")[0]!;
    const type = String(reply.getHeader("content-type") ?? "");
    if (
      typeof payload !== "string" ||
      // The refusal of a host no website has, which is no website's page
      // (unknownHost.feature), and so has no website to name pictures of.
      reply.statusCode === 421 ||
      !type.startsWith("text/html") ||
      isTheApi(path) ||
      request.servedAs === undefined ||
      !payload.includes(headEnd)
    ) {
      done(null, payload);
      return;
    }

    const website = websiteOf(request);
    const picture = (file: string): string =>
      escape(pictureOf(assets, website.site, file));
    const tags = [
      `<link rel="icon" type="image/png" sizes="32x32" href="${picture("favicon-32x32.png")}" />`,
      ...(website.isTry
        ? []
        : [
            `<link rel="manifest" href="${manifestPath}" />`,
            `<link rel="apple-touch-icon" href="${picture("apple-icon-180x180.png")}" />`,
            `<meta name="theme-color" content="${barsInLight}" media="(prefers-color-scheme: light)" />`,
            `<meta name="theme-color" content="${barsInDark}" media="(prefers-color-scheme: dark)" />`,
          ]),
    ]
      .map(
        (tag) => `    ${tag}
`,
      )
      .join("");

    // The length it was sent with is for the page without them.
    reply.removeHeader("content-length");
    // A function, so that a "$" in what is put in is not read as a pattern of
    // the replacement.
    done(
      null,
      payload.replace(headEnd, () => `${tags}  ${headEnd}`),
    );
  });
};

// The link to the help that says how the site is put on the home screen, which
// every reader is offered and not only one whose browser can install the site:
// a browser that never says it can, such as Safari on an iPhone, is the one that
// has most need of being told how (homeScreenLink.feature). It is not worked
// out from which phone the reader has, which goes wrong each time a phone or a
// browser changes, and misses the reader it matters most to.
const homeScreenHelp = (speaking: Speaking): string =>
  `<a class="home-screen-help" href="/help/readers/home-screen">${escape(speaking.say("footer.addToHomeScreen"))}</a>`;

// The link, the button that offers to install the site, and the script that
// shows the one in place of the other.
//
// The button is hidden until the browser says the site can be installed, so
// that it is never a button that does nothing, and it takes the link's place
// while it is there, since a link beside a button that already does it would be
// a second way to the same place and a longer one. It is an addition to the
// page as the text size is: without scripting there is no button, and the link
// is what there is. It is used once, since a browser lets an offer be used
// once. A reader who turns the offer down has still not put the site there and
// the browser will not offer again at once, so the link comes back; one who
// accepts has, and has neither. A site already open as an installed app has
// nothing to offer.
//
// Written without arrow functions, const or template strings, like the other
// scripts on the page, for the older tablets the site is still read on.
export const installOffer = (speaking: Speaking): string => `
          ${homeScreenHelp(speaking)}
          <button type="button" class="install-site" hidden>${escape(speaking.say("footer.installSite"))}</button>
          <script>
            (function () {
              var button = document.currentScript.previousElementSibling;
              var link = button.parentElement.querySelector(".home-screen-help");
              var offer = null;
              var settled = false;
              var showLink = function (shown) {
                if (link) link.hidden = !shown;
              };
              var installed =
                (window.matchMedia &&
                  window.matchMedia("(display-mode: standalone)").matches) ||
                window.navigator.standalone === true;
              if (installed) {
                showLink(false);
                return;
              }
              window.addEventListener("beforeinstallprompt", function (event) {
                // Without this the browser shows its own prompt at once,
                // and the button is the reader's to press instead.
                event.preventDefault();
                offer = event;
                button.hidden = false;
                showLink(false);
              });
              window.addEventListener("appinstalled", function () {
                settled = true;
                offer = null;
                button.hidden = true;
                showLink(false);
              });
              var turnedDown = function () {
                if (!settled) showLink(true);
              };
              button.addEventListener("click", function () {
                var given = offer;
                if (given === null) return;
                offer = null;
                button.hidden = true;
                // A browser may refuse even for a press, and a refusal is the
                // offer turned down and not an error to leave for the console.
                var shown = given.prompt();
                if (shown && shown.catch) shown.catch(turnedDown);
                if (given.userChoice && given.userChoice.then) {
                  given.userChoice.then(function (choice) {
                    if (choice.outcome !== "accepted") turnedDown();
                  }, turnedDown);
                }
              });
            })();
          </script>`;
