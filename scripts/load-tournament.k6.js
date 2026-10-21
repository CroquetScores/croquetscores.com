// Load test for the public pages of one tournament, run with k6 (https://k6.io):
//
//   k6 run scripts/load-tournament.k6.js
//   k6 run -e BASE_URL=http://localhost:3000 -e TOURNAMENT=/2016/ac/aust-eire-cup scripts/load-tournament.k6.js
//
// To find where the site gives way rather than to check it copes, raise the
// peak number of readers and take away their pauses, so that each one asks for
// the next page as soon as the last has come:
//
//   k6 run -e PEAK=500 -e PAUSE=0 scripts/load-tournament.k6.js
//
// Each virtual reader opens the tournament's page and then follows the links on
// it that stay inside the tournament, which is what a spectator does. Links are
// read from the page rather than listed here, so the test follows whatever the
// tournament has and does not go stale when its pages change.
//
// Nobody signs in. Two of the site's limits count by the address a request
// comes from, but they count sign-in failures and requests for a way back in,
// which this test makes none of, so it can run from one machine.
import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const tournament = __ENV.TOURNAMENT || "/2016/ac/aust-eire-cup";
const peak = Number(__ENV.PEAK || 100);
// A reader pauses between pages, as a person does. Without the pauses each
// reader is far heavier than a person, so the same PEAK asks much more of the
// site; that is the point of turning them off.
const pause = __ENV.PAUSE !== "0";

// Ramp up to a fifth of the peak, then to the peak, then down. Thresholds make
// the run fail, and k6 exit non-zero, when readers would have noticed: slow
// pages or any that errored.
export const options = {
  stages: [
    { duration: "30s", target: Math.ceil(peak / 5) },
    { duration: "1m", target: peak },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"],
  },
};

// The links on the tournament's page that lead further into the tournament.
// Done once, before any reader starts, so every reader is given the same list.
export function setup() {
  const response = http.get(`${baseUrl}${tournament}`);
  if (response.status !== 200) {
    throw new Error(
      `${baseUrl}${tournament} answered ${response.status}, so there is nothing to test. Is the site running?`,
    );
  }

  const paths = new Set();
  for (const match of response.body.matchAll(/href="([^"#]+)"/g)) {
    const path = match[1].replace(/&amp;/g, "&");
    if (path.startsWith(`${tournament}/`)) paths.add(path);
  }
  return { paths: [...paths] };
}

export default function (data) {
  const page = http.get(`${baseUrl}${tournament}`);
  check(page, { "tournament page is 200": (r) => r.status === 200 });

  // A reader looks at a few pages, not all of them.
  const count = Math.min(3, data.paths.length);
  for (let i = 0; i < count; i++) {
    const path = data.paths[Math.floor(Math.random() * data.paths.length)];
    const response = http.get(`${baseUrl}${path}`, { tags: { name: path } });
    check(response, { "linked page is 200": (r) => r.status === 200 });
    if (pause) sleep(1 + Math.random() * 2);
  }
}
