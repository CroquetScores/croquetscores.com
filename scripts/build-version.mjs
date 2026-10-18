// "npm run build:version". Works out which version this build is, from the
// history of the repository it is built in (buildVersion.feature), and writes
// it to dist/version.json for the site to read as it starts. Where the history
// is not whole, as in a build in CI, it writes none and takes away any the last
// build left, and says so without failing: a build that cannot know its
// version is still a build.
import { join } from "node:path";

import {
  versionOfHistory,
  writeBuiltVersion,
} from "../src/infrastructure/version/buildVersion.js";

const root = join(import.meta.dirname, "..");
const version = versionOfHistory(root);
writeBuiltVersion(join(root, "dist", "version.json"), version);
console.log(
  version === undefined
    ? "No version: the history here is not whole."
    : `Version ${String(version)}.`,
);
