# BH·AI Study Tools

Practice tools for Belmont Hill students: quizzes, flashcards, practice labs, and test prep, built by the **Belmont Hill AI Club**. Browse by subject on the site.

**Site:** https://belmonthill-ai.github.io/
**Want to add yours?** Read [CONTRIBUTING.md](CONTRIBUTING.md).

## How it's organized

```
projects/<slug>/project.json   one folder per study tool (title, subject, course, authors…)
projects/<slug>/index.html     the tool itself, when it's hosted here (optional)
templates/new-project/         starter files for a new hosted tool
site.json                      the list of subjects and formats, plus site text
index.html, assets/            the homepage: search + filter by subject
scripts/build-catalog.mjs      checks every project.json and builds catalog.json
AGENTS.md                      instructions for AI coding tools (CLAUDE.md points here)
```

Every pull request runs `build-catalog.mjs --check`, so a typo in a `project.json` gets caught before merge. Every push to `main` rebuilds the catalog and redeploys GitHub Pages.

## Preview locally

```bash
node scripts/build-catalog.mjs
python3 -m http.server
```

Then open http://localhost:8000.

## For club leaders

- **Who can add tools:** only repo collaborators (AI Club members). Outsiders can view the code but can't change the site.
- **Adding a subject or format:** edit `site.json`.
- **Filter links to share:** `?subject=Science`, `?q=DBQ`, or combine them, like `?subject=Math&q=calc`.
- **One-time setup:** in Settings → Pages, set **Source** to **GitHub Actions**.
