import js from "@eslint/js";
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

export default tseslint.config(
  { ignores: ["dist", "reports", "node_modules", "assets"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.ts", "*.mjs", "scripts/*.mjs"],
          // The scripts and the configuration files are plain JavaScript with
          // no project of their own, and there are now more of them than the
          // default of eight allows for.
          maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 16,
        },
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
      // Named rather than pulled from a globals package: this is the whole list
      // these files use, and a short list that is true beats a long one.
      globals: { console: "readonly", process: "readonly" },
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
  {
    files: ["src/domain/**/*.ts", "specs/domain/**/*.ts"],
    rules: forbid(
      "domain does not know that application, infrastructure or web exist.",
      "**/application/**",
      "**/infrastructure/**",
      "**/web/**",
      "**/import-ravendb/**",
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
            ...[
              "**/application/**",
              "**/infrastructure/**",
              "**/web/**",
              "**/import-ravendb/**",
            ].map((group) => ({
              group: [group],
              message:
                "domain does not know that application, infrastructure or web exist.",
            })),
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
      "**/import-ravendb/**",
    ),
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
            ...["**/infrastructure/**", "**/import-ravendb/**"].map(
              (group) => ({
                group: [group],
                message:
                  "only the composition root, src/web/server.ts, may name infrastructure.",
              }),
            ),
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
  // The import from the old sites is put together from the layers, as the
  // site is, and nothing in them knows it is there: it goes when the old
  // sites' data is all brought over, and must take nothing with it.
  {
    files: ["src/infrastructure/**/*.ts"],
    rules: forbid(
      "nothing the site is made of knows about the import from the old sites.",
      "**/import-ravendb/**",
    ),
  },
);
