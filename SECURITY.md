# Security Policy

Bookmark Cleaner processes bookmark exports locally and performs no network requests. Treat bookmark files as sensitive because URLs and titles can reveal private browsing context.

## Supported version
Security fixes target the latest release on `main`.

## Reporting
Please report security issues privately through GitHub's security reporting facilities when available. Do not publish private bookmark exports or exploit details in a public issue.

## Scope
The tool intentionally accepts only `http:` and `https:` bookmarks when producing cleaned output. It does not check whether remote sites are safe, reachable, or trustworthy, and it does not claim to detect phishing or malware.
