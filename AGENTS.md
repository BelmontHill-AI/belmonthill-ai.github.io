# Instructions for AI coding tools

This repo is the Belmont Hill AI Club's study-tools website, published with GitHub Pages. Students add practice tools (quizzes, flashcards, study guides) for their classes. Most contributors are high school students working with an AI tool like Claude Code, Cursor, Copilot, or Codex. **You are probably helping one of them right now.**

Your job is usually one of the tasks below. Keep changes inside the student's own project folder unless they clearly ask for something else.

## How the site works

```
site.json                    subjects, formats, and site text (shared, so change rarely)
index.html, assets/          the homepage (shared, so don't edit when adding a project)
projects/<slug>/project.json  metadata for one tool  ← students add these
projects/<slug>/index.html    the tool itself, if hosted here (optional)
templates/new-project/       copy this to start a new hosted tool
scripts/build-catalog.mjs    validates every project.json and builds catalog.json
```

The homepage reads `catalog.json`, which the build script generates. Never edit or commit `catalog.json` by hand; it's in `.gitignore`.

A project is one of two kinds:

- **Link**: `project.json` has a `"url"` (usually `https://claude.ai/artifact/...`) and there is no `index.html`. The card opens the link in a new tab.
- **Hosted**: the folder has an `index.html`. The card opens `projects/<slug>/`. Prefer this kind when possible because it keeps working even if the original link goes away.

## Task: add a new project

1. Choose a slug: lowercase, dashes, and specific, like `ap-bio-unit-2-flashcards`. Check that `projects/<slug>/` doesn't already exist.
2. Create `projects/<slug>/project.json`:

   ```json
   {
     "title": "AP Bio Unit 2 Flashcards",
     "subject": "Science",
     "course": "AP Biology",
     "description": "Under 200 characters. Say what a student can DO with it.",
     "authors": ["First L."],
     "formats": ["Flashcards"],
     "tags": ["cell membrane", "unit 2"],
     "url": "https://claude.ai/artifact/...",
     "added": "YYYY-MM-DD"
   }
   ```

   - `subject` must be **exactly** one of the names in `site.json` → `subjects`.
   - `formats` must come from `site.json` → `formats`.
   - `authors`: use **first name + last initial** only, because the site is public. Ask the student for it; don't guess.
   - `added`: use today's date.
   - `course` and `tags` are optional. Leave out `url` for a hosted project.
3. For a hosted project, add `projects/<slug>/index.html` (see the rules below). You can start from `templates/new-project/index.html`.
4. Run `node scripts/build-catalog.mjs` and fix anything it reports.
5. Preview with `python3 -m http.server` and open http://localhost:8000. Check that the card shows up and opens correctly.
6. Commit on a branch and open a pull request. CI runs the same validation.

## Task: port a Claude artifact into the repo (link → hosted)

The student pastes or downloads the artifact's HTML into `projects/<slug>/index.html`. Then:

1. **Remove every `window.claude` call.** That API only exists on claude.ai, and the build fails if any remain. Typical replacements:
   - `window.claude.use(...)` storage or state → `localStorage`, keyed by `"bhai:<slug>:..."` and **wrapped in try/catch** (storage can be blocked in school-managed or private browsers). The page must still work when storage fails.
   - Signed-in user or identity features → remove them, or ask the student for a name in a simple input.
   - Calls that ask Claude a question at runtime → remove the feature, or replace it with pre-written content. **Never** add an API key: this repo is public.
2. Keep it a single self-contained file where possible. Scripts from cdnjs.cloudflare.com or cdn.jsdelivr.net with exact pinned versions are fine.
3. Add a small `<a href="../../">← All study tools</a>` link near the top.
4. Remove `"url"` from `project.json`. A folder with an `index.html` is hosted automatically.
5. Open the page locally and click through every tab or mode. Check that it saves progress and that nothing errors in the console.

## Task: edit an existing project

Only edit the project the student owns, unless they say otherwise. Keep `project.json` valid and re-run the build script.

## Rules

- **Accuracy matters more than polish.** Students will study from this. When you generate questions or answers, double-check them, and tell the student to verify anything you're unsure of against their class notes.
- No secrets, API keys, tracking scripts, or personal info beyond first name + last initial.
- No copyrighted textbook passages or full test banks pasted in. Write original questions, or use short quotes for analysis.
- Don't change `site.json`, `index.html`, `assets/`, `scripts/`, or `.github/` as part of adding a project. If a new subject or format is really needed, say so in the PR description so a club leader can decide.
- Keep pages readable on a phone, and make sure they work in light and dark mode.
