# Versioning

The project uses [Semantic Versioning](https://semver.org/) for the site and its tooling. The snippet library has no version of its own: each snippet carries its own `verified` date and package versions instead.

Because the project is a website and not a dependency, "breaking" means something specific here.

| Bump | When |
| --- | --- |
| **MAJOR** | A change that breaks contributors or existing links, such as a new required frontmatter field, a renamed category folder, or a URL scheme change |
| **MINOR** | A new site feature, a new category, or a new optional frontmatter field |
| **PATCH** | A bug fix, dependency update, or documentation change |

Adding, re-checking, or correcting snippets doesn't bump the version. Only notable snippet changes, such as covering a new provider, go in the changelog.

The project is at `0.x` until the layout and frontmatter are stable, and minor releases may include breaking changes until then.

## Releasing

1. List the changes under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md), grouped as **Added**, **Changed**, **Fixed**, or **Removed**.
2. Rename that section to the new version and date, add a fresh `[Unreleased]` above it, and update the links at the bottom of the file.
3. Run `npm version 0.2.0 --no-git-tag-version` to set the version in `package.json` and `package-lock.json`.
4. Commit as `chore(repo): Release v0.2.0`.
5. Tag and push:

   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

6. Optionally create a GitHub release and paste in the changelog section.

The site deploys from `main` on every push, whether or not a release is tagged.
