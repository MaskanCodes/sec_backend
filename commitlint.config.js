module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "body-leading-blank": [2, "always"],
        "footer-leading-blank": [2, "always"],
        "header-max-length": [2, "always", 100],
        "scope-enum": [2, "always", [""]],
        "subject-case": [2, "always", "sentence-case"],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],
        "type-enum": [
            2,
            "always",
            ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "style", "test"],
        ],
    },
};
