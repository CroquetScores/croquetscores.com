// A browser prints what runs past the edge of the paper as nothing, and goes on
// with none of it on a page beside, so a block with many players or a knockout
// with many rounds loses its right-hand side. Style cannot cut a table or a row
// of rounds between columns, so just before the page is printed this cuts each
// that is wider than the paper into pieces that each fit it, one after another,
// and once it is printed puts the page back. The browser sends the events
// either side of laying the page out for the printer, and the page it prints is
// the one as they leave it.
//
// A block's grid has the column of players' names again at the left of every
// piece, since a score with no name beside it says whose it is to no one. A
// knockout is cut between one round and the next, and a round is never cut. The
// pieces start on pages of their own (site.css).
//
// What the paper is wide enough for is the stylesheet's --print-width, which is
// less than the narrowest paper a page is likely to be printed on, with the
// margins it leaves, since the page cannot ask the printer what it has. The
// browser's own scaling is not looked at: a reader who shrinks the page to
// print has more room than this takes, which loses them nothing but a page.
//
// Written beside the page it is for, as the print button's script is, and not
// in a file of its own, so that there is nothing to be fetched before the page
// can be printed.
export const printPiecesScript = `          <script>
            (function () {
              var each = Array.prototype.forEach;
              var made = [];
              var hidden = [];

              var widthOf = function (element) {
                return element.getBoundingClientRect().width;
              };

              var paperWidth = function () {
                var ruler = document.createElement("div");
                ruler.style.cssText =
                  "position:absolute;visibility:hidden;width:var(--print-width)";
                document.body.appendChild(ruler);
                var width = widthOf(ruler);
                ruler.remove();
                return width;
              };

              // The places of what is in the widths, in runs that each fit the
              // room with what is taken before them, a run of at least one.
              var runsOf = function (widths, taken, room) {
                var runs = [];
                var run = [];
                var used = taken;
                widths.forEach(function (width, at) {
                  if (run.length > 0 && used + width > room) {
                    runs.push(run);
                    run = [];
                    used = taken;
                  }
                  run.push(at);
                  used += width;
                });
                if (run.length > 0) runs.push(run);
                return runs;
              };

              // The pieces are put after what they are cut from, which is not
              // printed. Printed ones are marked, to be taken away again.
              var putAfter = function (whole, pieces) {
                whole.setAttribute("data-print-split", "");
                hidden.push(whole);
                var after = whole;
                pieces.forEach(function (piece) {
                  piece.classList.add("print-piece");
                  after.parentNode.insertBefore(piece, after.nextSibling);
                  made.push(piece);
                  after = piece;
                });
              };

              var cutGrid = function (table, room) {
                var widths = Array.prototype.map.call(table.rows[0].cells, widthOf);
                var runs = runsOf(widths.slice(1), widths[0], room);
                if (runs.length < 2) return;
                var pieces = runs.map(function (columns) {
                  var copy = table.cloneNode(false);
                  each.call(table.children, function (section) {
                    var kept = section.cloneNode(false);
                    each.call(section.rows, function (row) {
                      var line = row.cloneNode(false);
                      line.appendChild(row.cells[0].cloneNode(true));
                      columns.forEach(function (at) {
                        line.appendChild(row.cells[at + 1].cloneNode(true));
                      });
                      kept.appendChild(line);
                    });
                    copy.appendChild(kept);
                  });
                  var scroll = document.createElement("div");
                  scroll.className = "block-grid-scroll";
                  scroll.appendChild(copy);
                  return scroll;
                });
                putAfter(table.parentNode, pieces);
              };

              var cutDraw = function (draw, room) {
                var rounds = Array.prototype.slice.call(draw.children);
                var runs = runsOf(rounds.map(widthOf), 0, room);
                if (runs.length < 2) return;
                var pieces = runs.map(function (at) {
                  var copy = draw.cloneNode(false);
                  at.forEach(function (round) {
                    var kept = rounds[round].cloneNode(true);
                    // The whole keeps the names the page's links go to.
                    each.call(kept.querySelectorAll("[id]"), function (named) {
                      named.removeAttribute("id");
                    });
                    kept.removeAttribute("id");
                    copy.appendChild(kept);
                  });
                  return copy;
                });
                putAfter(draw, pieces);
              };

              var putBack = function () {
                made.forEach(function (piece) {
                  piece.remove();
                });
                hidden.forEach(function (whole) {
                  whole.removeAttribute("data-print-split");
                });
                made = [];
                hidden = [];
              };

              window.addEventListener("beforeprint", function () {
                putBack();
                var room = paperWidth();
                each.call(document.querySelectorAll("main table.block-grid"), function (table) {
                  cutGrid(table, room);
                });
                each.call(document.querySelectorAll("main .knockout"), function (draw) {
                  cutDraw(draw, room);
                });
              });
              window.addEventListener("afterprint", putBack);
            })();
          </script>`;
