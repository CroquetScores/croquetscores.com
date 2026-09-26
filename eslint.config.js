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
  {
    files: ["src/web/**/*.ts", "src/web/**/*.tsx"],
    ignores: ["src/web/server.ts"],
    rules: forbid(
      "only the composition root, src/web/server.ts, may name infrastructure.",
      "**/infrastructure/**",
      "**/import-ravendb/**",
    ),
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
