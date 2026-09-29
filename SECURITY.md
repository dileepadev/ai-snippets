# Security Policy

## Scope

ai-snippets is a static website plus a folder of Markdown snippets. The site has no accounts, database, or server. Reports that fit this scope:

- **Secrets:** a real API key, token, or credential committed in a snippet or anywhere else in the repository.
- **Site code:** cross-site scripting, unsafe handling of the URL or of saved-list data in the browser, or other flaws in `src/` and `scripts/`.
- **Supply chain:** a compromised or malicious dependency, or a CI workflow in `.github/workflows/` that could be abused.
- **Misleading snippets:** a snippet that differs from its official source in a way that would put users at risk, such as insecure defaults that the source does not have.

Vulnerabilities in the SDKs and APIs the snippets describe belong with their vendors. If an official snippet is itself insecure, report it upstream and let us know so we can add a note.

## Reporting

Please don't open a public issue. Use [GitHub's private vulnerability reporting](https://github.com/dileepadev/ai-snippets/security/advisories/new), or email **<contact@dileepa.dev>** with:

- what you found and where,
- steps to reproduce it,
- the impact you expect.

If you find a leaked key belonging to someone else, revoke it with its provider first if you can.

## What to expect

- We acknowledge a report within a few days.
- We confirm the issue, fix it, and tell you when it is done.
- We credit you in the fix if you want that.

This is a volunteer-maintained project, so those times are targets, not guarantees. We don't run a bug bounty.

## Supported versions

Only the latest version on `main`, which is what the site serves, is supported.
