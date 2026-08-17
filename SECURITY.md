# Security Policy

This is a personal portfolio website. Even so, security reports are welcome.

## Reporting a Vulnerability

If you discover a security issue, please report it privately by email:

- **Email:** alokkumawat2004@gmail.com

Please include:
- A description of the issue and its potential impact
- Steps to reproduce (or a proof of concept)
- Any relevant URLs, requests, or screenshots

Please do **not** open a public issue for security reports. I will acknowledge
receipt as soon as possible and keep you updated on the fix.

## Scope

- The static frontend (this site) and its configuration.
- No user accounts, payments, or personal data are stored by this site.

## Good to know

- The contact form uses EmailJS with a browser-safe public key that can only
  send this single template. No privileged credentials are exposed client-side.
- Secrets are kept in environment variables and are never committed to git.
- HTTP security headers (CSP, HSTS, X-Frame-Options, etc.) are enforced at the
  hosting layer (see `frontend/vercel.json`).
