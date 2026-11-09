#!/usr/bin/env node
// Builds catalog.json from every projects/<slug>/project.json.
//
//   node scripts/build-catalog.mjs          validate + write catalog.json
//   node scripts/build-catalog.mjs --check  validate only (used on pull requests)
//
// No dependencies. Error messages are written so a student (or their AI tool)
// can read them and fix the problem directly.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_ONLY = process.argv.includes("--check");

const site = JSON.parse(readFileSync(join(ROOT, "site.json"), "utf8"));
const SUBJECTS = site.subjects.map((s) => s.name);
const FORMATS = site.formats;

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_KEYS = new Set([
  "title", "subject", "course", "description", "authors",
  "formats", "url", "tags", "added",
]);

const errors = [];
const projects = [];
const projectsDir = join(ROOT, "projects");

const slugs = existsSync(projectsDir)
  ? readdirSync(projectsDir).filter(
      (n) => !n.startsWith(".") && statSync(join(projectsDir, n)).isDirectory()
    )
  : [];

for (const slug of slugs) {
  const dir = join(projectsDir, slug);
  const where = `projects/${slug}`;
  const fail = (msg) => errors.push(`${where}: ${msg}`);

  if (!SLUG_RE.test(slug)) {
    fail(`folder name must be lowercase-with-dashes (e.g. "ap-chem-practice-lab").`);
    continue;
  }

  const metaPath = join(dir, "project.json");
  if (!existsSync(metaPath)) {
    fail(`missing project.json. Copy templates/new-project/project.json into this folder.`);
    continue;
  }

  let p;
  try {
    p = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch (e) {
    fail(`project.json is not valid JSON (${e.message}). Check for trailing commas or missing quotes.`);
    continue;
  }

  for (const key of Object.keys(p)) {
    if (!ALLOWED_KEYS.has(key)) fail(`unknown field "${key}" in project.json. Allowed: ${[...ALLOWED_KEYS].join(", ")}.`);
  }

  const str = (k, max, required = true) => {
    const v = p[k];
    if (v === undefined || v === "") {
      if (required) fail(`"${k}" is required.`);
      return;
    }
    if (typeof v !== "string") return fail(`"${k}" must be text.`);
    if (v.length > max) fail(`"${k}" is ${v.length} characters; keep it under ${max}.`);
  };
  str("title", 60);
  str("course", 40, false);
  str("description", 200);

  if (!SUBJECTS.includes(p.subject)) {
    fail(`"subject" must be exactly one of: ${SUBJECTS.join(", ")}. Got ${JSON.stringify(p.subject)}.`);
  }

  if (!Array.isArray(p.authors) || p.authors.length === 0 || !p.authors.every((a) => typeof a === "string" && a.trim())) {
    fail(`"authors" must be a list with at least one name, e.g. ["Ari I."].`);
  }

  if (!Array.isArray(p.formats) || p.formats.length === 0) {
    fail(`"formats" must be a list, e.g. ["Practice questions", "Flashcards"]. Options: ${FORMATS.join(", ")}.`);
  } else {
    for (const f of p.formats) if (!FORMATS.includes(f)) fail(`format "${f}" isn't recognized. Options: ${FORMATS.join(", ")}.`);
  }

  if (p.tags !== undefined && (!Array.isArray(p.tags) || !p.tags.every((t) => typeof t === "string"))) {
    fail(`"tags" must be a list of words, e.g. ["stoichiometry", "unit 4"].`);
  }

  if (!DATE_RE.test(p.added ?? "")) fail(`"added" must be a date like "2026-11-09".`);

  const hosted = existsSync(join(dir, "index.html"));
  if (p.url !== undefined) {
    if (typeof p.url !== "string" || !p.url.startsWith("https://")) fail(`"url" must start with https://`);
  }
  if (!hosted && !p.url) {
    fail(`needs either an index.html in the folder (hosted) or a "url" in project.json (link).`);
  }

  if (hosted) {
    const html = readFileSync(join(dir, "index.html"), "utf8");
    if (/window\.claude\b/.test(html)) {
      fail(`index.html uses window.claude, which only works on claude.ai. Replace it with localStorage (see AGENTS.md, "Task: port a Claude artifact into the repo").`);
    }
    if (/sk-ant-|sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}/.test(html)) {
      fail(`index.html looks like it contains an API key. Remove it: everything in this repo is public.`);
    }
  }

  projects.push({
    slug,
    title: p.title,
    subject: p.subject,
    course: p.course ?? "",
    description: p.description,
    authors: p.authors,
    formats: p.formats,
    tags: p.tags ?? [],
    added: p.added,
    hosted,
    href: hosted ? `projects/${slug}/` : p.url,
  });
}

if (errors.length) {
  console.error(`\n✗ Found ${errors.length} problem${errors.length > 1 ? "s" : ""}:\n`);
  for (const e of errors) console.error("  • " + e);
  console.error("");
  process.exit(1);
}

projects.sort((a, b) => b.added.localeCompare(a.added) || a.title.localeCompare(b.title));

console.log(`✓ ${projects.length} projects look good.`);

if (!CHECK_ONLY) {
  const catalog = {
    generated: new Date().toISOString(),
    site,
    projects,
  };
  writeFileSync(join(ROOT, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
  console.log("  Wrote catalog.json");
}
