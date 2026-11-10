// Lets a reader pinch the text smaller and pull it larger, on every page that
// is drawn with the shared layout.
//
// The text is scaled through the size of the root element rather than by the
// browser's own zoom, because the stylesheet is written in rem. Zoom makes the
// page wider than the screen and leaves a reader scrolling sideways; a larger
// root size makes the lines wrap instead. The browser's zoom is therefore
// switched off for a touch (the stylesheet's touch-action on html), and the
// gesture is read here.
//
// Half to double is what a reader can still use. Narrower than that, the text
// cannot be read; wider, a long word no longer fits on a line.
//
// The size is kept in localStorage rather than a cookie. It only matters to the
// browser, so there is no reason to send it to the server with every request,
// and nothing on the server could use it. It is read in the head, before the
// body is drawn, so that a page is never shown at one size and then moved to
// another.
//
// Written without arrow functions, const or template strings, like the other
// scripts on the page, for the older tablets the site is still read on.
export const textSizeScript = `    <script>
      (function () {
        var key = "textSize";
        var least = 50;
        var most = 200;
        var root = document.documentElement;
        var apply = function (percent) {
          root.style.fontSize = percent + "%";
        };
        var kept = function () {
          try {
            var value = parseFloat(window.localStorage.getItem(key));
            return value >= least && value <= most ? value : 100;
          } catch (unavailable) {
            return 100;
          }
        };
        var keep = function (percent) {
          try {
            window.localStorage.setItem(key, String(percent));
          } catch (unavailable) {
            // The size still holds for this page, which is all that was lost.
          }
        };
        var gap = function (touches) {
          return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY,
          );
        };
        var size = kept();
        if (size !== 100) apply(size);

        var from = 0;
        var starting = size;
        document.addEventListener("touchstart", function (event) {
          if (event.touches.length === 2) {
            from = gap(event.touches);
            starting = size;
          }
        }, { passive: true });
        document.addEventListener("touchmove", function (event) {
          if (event.touches.length !== 2 || from === 0) return;
          // Held back so the browser does not scroll or zoom the page while
          // the two fingers are on it. One finger is never held back.
          event.preventDefault();
          size = Math.round(
            Math.min(most, Math.max(least, (starting * gap(event.touches)) / from)),
          );
          apply(size);
        }, { passive: false });
        document.addEventListener("touchend", function (event) {
          if (event.touches.length < 2 && from !== 0) {
            from = 0;
            keep(size);
          }
        }, { passive: true });
      })();
    </script>
`;
