import js from "@eslint/js";
import { dirname, relative, resolve, sep } from "node:path";
import tseslint from "typescript-eslint";

/**
 * @param {string} message
 * @param {...string} groups
 * @returns {import("eslint").Linter.RulesRecord}
 */
const forbid = (message, ...groups) => ({
  "no-restricted-imports": [
    "error",
    { patterns: groups.map((group) => ({ group: [group], message })) },
  ],
});

// The black-box specs know the site by its address and nothing else, so what
// one of them may import is decided by where the import leads, which a pattern
// cannot say: ../support/world.js is its own support from one folder and the
// repository's from another. Packages are an allow list, and anything outside
// specs/web fails, whatever it is called.
const blackBoxPackages = new Set(["@cucumber/cucumber", "playwright", "pg"]);
const blackBox = {
  meta: {
    type: "problem",
    messages: {
      outside:
        "specs/web knows the site by its address alone (AI.md §5). {{ what }} is not in specs/web.",
      package:
        "specs/web may use only {{ allowed }} and Node's own modules, not {{ what }}.",
    },
    schema: [],
  },
  create(context) {
    const web = resolve(import.meta.dirname, "specs", "web");
    const check = (node) => {
      const what = node.source?.value;
      if (typeof what !== "string") return;
      if (what.startsWith(".")) {
        const target = resolve(dirname(context.filename), what);
        const inside = relative(web, target);
        if (inside === ".." || inside.startsWith(`..${sep}`)) {
          context.report({ node, messageId: "outside", data: { what } });
        }
        return;
      }
      if (what.startsWith("node:") || blackBoxPackages.has(what)) return;
      context.report({
        node,
        messageId: "package",
        data: { what, allowed: [...blackBoxPackages].join(", ") },
      });
    };
    return {
      ImportDeclaration: check,
      ExportAllDeclaration: check,
      ExportNamedDeclaration: check,
      ImportExpression: (node) => {
        const what = node.source;
        if (what.type !== "Literal") {
          context.report({
            node,
            messageId: "package",
            data: { what: "a computed import", allowed: "its own files" },
          });
        } else check({ ...node, source: what });
      },
    };
  },
};

export default tseslint.config(
  {
    ignores: [
      "dist",
      "reports",
      "node_modules",
      "assets",
      // Runs in k6's own runtime, which has its own globals and imports.
      "scripts/*.k6.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // Only the TypeScript configuration at the root belongs to no project.
        // The scripts and the other configuration are plain JavaScript, and are
        // parsed without one (below), so they do not count towards its limit.
        projectService: { allowDefaultProject: ["*.ts"] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Configuration and tooling are plain JavaScript with no project of their
  // own, so there are no types to check them against.
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      // Kept from the line above, which this object would otherwise replace:
      // without it these files are still parsed against the default project,
      // and each one counts towards its limit.
      ...tseslint.configs.disableTypeChecked.languageOptions,
      // Named rather than pulled from a globals package: this is the whole list
      // these files use, and a short list that is true beats a long one.
      globals: {
        AbortSignal: "readonly",
        Buffer: "readonly",
        console: "readonly",
        fetch: "readonly",
        process: "readonly",
      },
    },
  },
  // The admin SPA has its own tsconfig, which the project service finds.
  {
    files: ["src/web/admin/**/*.tsx", "src/web/admin/**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // specs/web runs the site as a process and knows it by its address. Loading
  // anything of the repository's would make a scenario here a statement about
  // how the site is built, which is what specs/web-units is for.
  {
    files: ["specs/web/**/*.ts"],
    plugins: { "black-box": { rules: { "only-the-site": blackBox } } },
    rules: { "black-box/only-the-site": "error" },
  },
  {
    files: ["src/domain/**/*.ts", "specs/domain/**/*.ts"],
    rules: forbid(
      "domain does not know that application, infrastructure or web exist.",
      "**/application/**",
      "**/infrastructure/**",
      "**/web/**",
    ),
  },
  // What every aggregate shares names no aggregate, or it stops being shared.
  // The one exception is who did it: every event says which account caused it,
  // so the account's id is named here by everything. It is excepted by name so
  // that a second such import fails the build rather than following the first.
  // A later block replaces an earlier one's rule outright, so the domain's own
  // restrictions are said again.
  {
    files: ["src/domain/common/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...["**/application/**", "**/infrastructure/**", "**/web/**"].map(
              (group) => ({
                group: [group],
                message:
                  "domain does not know that application, infrastructure or web exist.",
              }),
            ),
            {
              // A regex rather than a group: a group is read as gitignore
              // would read it, and a file cannot be let back in from under a
              // directory that has been shut out.
              regex: "/aggregates/(?!accounts/AccountId\\.js$)",
              message:
                "domain/common is shared by every aggregate and names none of them, except the id of the account that caused an event.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/application/**/*.ts",
      "specs/application/**/*.ts",
      "specs/support/**/*.ts",
    ],
    rules: forbid(
      "application names the interface; infrastructure implements it.",
      "**/infrastructure/**",
      "**/web/**",
    ),
  },
  // A query reads a read model and nothing else (SETUP.md §7.4): the public pages
  // of a tournament and the answers made for apps were once built on the
  // aggregates, which a page then rebuilt from the events on every request.
  // The aggregate stores are for the commands. This block says what the one
  // above says as well, since a later block's `no-restricted-imports` replaces
  // an earlier one's rather than adding to it.
  {
    files: [
      "src/application/operations/tournaments/Public*.ts",
      "src/application/operations/tournaments/*ForApps*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/**", "**/web/**"],
              message:
                "application names the interface; infrastructure implements it.",
            },
            {
              group: [
                "**/AggregateRepository",
                "**/AggregateRepository.js",
                "**/application/services/EventStore",
                "**/application/services/EventStore.js",
              ],
              message:
                "a query reads a read model and never the event store: ask for what the page shows by a read model's interface (SETUP.md §7.4).",
            },
          ],
        },
      ],
    },
  },
  // A page asks the mediator for what it reads and sends the mediator what it
  // writes. The event store, and the stores that load and save aggregates
  // from it, are handed by the composition root to the handlers alone: a page
  // that reached them would read past the read models and write past the
  // rules a command is held to. They are in the application layer, which the
  // web may otherwise name, so they are shut out by name.
  {
    files: ["src/web/**/*.ts", "src/web/**/*.tsx"],
    ignores: ["src/web/server.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/**"],
              message:
                "only the composition root, src/web/server.ts, may name infrastructure.",
            },
            // Each with and without its extension, either of which a
            // bundler would find.
            ...[
              "**/application/services/EventStore",
              "**/application/common/ProjectingEventStore",
              "**/application/common/AggregateRepository",
            ].map((group) => ({
              group: [group, `${group}.js`],
              message:
                "the web reads and writes through the mediator; only src/web/server.ts hands out the event store and the aggregate repositories.",
            })),
          ],
        },
      ],
    },
  },
);
