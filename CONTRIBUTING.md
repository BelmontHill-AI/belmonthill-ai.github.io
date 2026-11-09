# Adding your study tool

Built something that helped you study? Put it on the club site so every Belmont Hill student can use it. There are three ways to do it, from easiest to most involved.

---

## Option A: just send the link (2 minutes)

[Open an "Add my study tool" issue](https://github.com/palandjianpe/BH-AI/issues/new?template=add-project.yml), fill in the form, and paste your Claude artifact link. A club member will add it.

---

## Option B: let your AI tool do it (recommended)

You'll need a GitHub account (use your belmonthill.org email) that has accepted the club's invite.

1. Clone the repo, or open it in Claude Code, Cursor, or whichever AI tool you use:
   ```bash
   git clone https://github.com/palandjianpe/BH-AI.git
   cd BH-AI
   ```
2. Paste this prompt and fill in the blanks:

   > Read AGENTS.md. Then add my study tool to this repo as a new project.
   > - Title: ___
   > - Subject: ___ (Course: ___)
   > - What it does: ___
   > - My name for the site: ___ (first name + last initial)
   > - Link: ___ *(or: "here's the HTML, host it in the repo and port it off window.claude")*
   >
   > Run the build check, show me a local preview, then open a pull request.

3. Look at the preview yourself. **Click through it and check the answers.** Your AI tool can make mistakes, and people will study from this.
4. Once the pull request's checks pass (green ✓), a club leader reviews and merges it. The site updates about a minute later.

---

## Option C: do it by hand on github.com

1. On the repo page, go to **Add file → Create new file**.
2. Name it `projects/your-project-name/project.json`. Typing the `/` creates the folder.
3. Paste in the contents of [templates/new-project/project.json](templates/new-project/project.json), then edit it:
   - `subject` must be one of: Math, Science, English, History, World Languages, Computer Science, Arts, Test Prep, College, Other
   - `formats` can be any of: Practice questions, Quiz, Flashcards, Study guide, Writing practice, Timeline, Practice exam, Study plan, Tool
   - Add `"url": "https://claude.ai/artifact/..."` for your link
4. Choose **Create a new branch** and **Propose changes**, then open the pull request.
5. If the check fails, click **Details** and it will tell you exactly what to fix.

---

## Link vs. hosted

| | Link | Hosted |
|---|---|---|
| What's in the repo | just `project.json` with a `url` | `project.json` + your `index.html` |
| Effort | easiest | your AI tool has to port it (see AGENTS.md) |
| Saved progress | saves to the student's Claude account | saves in the student's browser |
| Survives if the Claude link breaks | no | yes |

Start with a link. Move to hosted when you have time.

## Ground rules

- **Check your answers.** A wrong answer key is worse than no answer key.
- Use **first name + last initial** on the site, because it's public.
- No API keys, passwords, or personal info. Everything in this repo is public.
- Write your own questions. Don't paste in textbook pages or teachers' tests.
- Only change your own project folder.
