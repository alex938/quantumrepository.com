# Quantum Repository

The Quantum Repository is a free, open educational site sharing hands-on guides for **cybersecurity, networking, Linux, Windows, Python, Docker, Kubernetes**, and homelab projects.

Live at: **[quantumrepository.com](https://quantumrepository.com)**

---

## Repository structure

This is a static HTML/CSS/JS site — no build step required. You can open `index.html` directly in a browser, or serve it with any static file server.

```
.
├── index.html              # Site homepage with guide directory + search/filter
├── error.html              # Custom 404 page (served by S3 error document)
├── main.css                # Shared design system (themes, layout, components)
├── guide.css               # Guide-page specific styles
├── accessibility.css       # Skip links, sr-only, focus indicators, motion prefs
├── guide.js                # Theme toggle, copy-code, back-to-top, etc.
├── sitemap.xml             # XML sitemap for search engines
├── .github/workflows/      # GitHub Actions: auto-deploy to S3 on push to main
│
├── cisco*/                 # CISCO networking guides (each in its own folder)
├── ad1/ … ad6/             # Active Directory lab series (multi-part)
├── code/                   # Python tutorials & projects
├── docker/                 # Docker / Swarm guides
├── kubernetes/             # Kubernetes guides
├── ssh/                    # SSH key auth guide
├── linuxhardening/         # Linux server hardening
├── bash/                   # Bash scripting fundamentals
├── powershellsysadmin/     # PowerShell for sysadmins
├── git/                    # Git fundamentals → intermediate
├── tlsdeepdive/            # TLS/HTTPS deep dive
├── dnsdeepdive/            # DNS deep dive
├── ipv6/                   # IPv6 fundamentals
├── vlantrunking/           # VLAN trunking + Inter-VLAN routing
├── adattacks/              # Active Directory attacks (lab only)
├── owasptop10/             # OWASP Top 10 (2021)
├── wireshark/              # Wireshark intro
├── cronvssystemd/          # cron vs systemd timers
├── nginxproxy/             # Nginx reverse proxy + TLS
├── dockercompose/          # Docker Compose deep dive
├── pythonadvancedpatterns/ # asyncio + type hints
├── vb/                     # VirtualBox lab setup
├── pfsenselab/             # VMware + pfSense lab
├── lhd/                    # Local host discovery
├── hangman/                # Python project: Hangman
└── hex/                    # Decimal ↔ hex conversion
```

Each guide folder follows the same convention: one `<topic>.html` page plus any reference images alongside.

---

## Running locally

You only need a static file server. Pick one:

```bash
# Python 3
python -m http.server 8000

# Node (with `npx`)
npx http-server -p 8000

# Or just open index.html in a browser
```

Then visit `http://localhost:8000`.

---

## Deployment

Pushes to `main` are auto-deployed to AWS S3 by `.github/workflows/main.yml`:

- Action used: [`jakejarvis/s3-sync-action`](https://github.com/jakejarvis/s3-sync-action)
- Sync flags: `--acl public-read --follow-symlinks --delete --exclude '.git*/*'`
- Required GitHub secrets:
  - `AWS_S3_BUCKET`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`

---

## Contributing

Contributions are welcome — typo fixes, broken-link reports, new guides, accessibility improvements, anything that helps learners. To contribute:

1. Fork the repo
2. Create a branch (`git checkout -b fix/something` or `feat/new-guide`)
3. Make your change. For new guides, follow the existing template (look at `ciscovlans/ciscovlans.html` for the modern structure).
4. Open a pull request describing the change

When adding a guide, please:
- Keep the visual structure consistent with `ciscovlans/ciscovlans.html`
- Use the existing CSS classes (`command-box`, `scenario-box`, etc.) instead of inline styles
- Include `loading="lazy"` and descriptive `alt` text on `<img>` tags
- Link `accessibility.css` in the `<head>` for skip-link support
- Frame any offensive-security material as defensive / lab-only and include mitigations

---

## License

See [`LICENSE`](LICENSE) for full terms. Content is provided as-is for educational purposes — never run commands you don't understand, and never test offensive techniques against systems you don't own.

---

## Contact

Email: **alex@slash-root.com**

If you find a factual error in a guide, please raise an issue or email me directly.
