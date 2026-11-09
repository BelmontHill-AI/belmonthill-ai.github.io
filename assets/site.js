// Renders catalog.json (built by scripts/build-catalog.mjs) into the homepage.
// Filter state lives in the URL (?subject=Math&q=derivatives) so links can be shared.

(() => {
  const $ = (id) => document.getElementById(id);
  const grid = $("grid"), chips = $("chips"), q = $("q"), sortSel = $("sort");
  const empty = $("empty"), error = $("error"), stats = $("stats");

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

  const params = new URLSearchParams(location.search);
  const state = {
    subject: params.get("subject") || "All",
    q: params.get("q") || "",
    sort: params.get("sort") || "new",
  };

  let projects = [];
  let colorOf = {};
  let subjectOrder = [];

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.subject !== "All") p.set("subject", state.subject);
    if (state.q) p.set("q", state.q);
    if (state.sort !== "new") p.set("sort", state.sort);
    const s = p.toString();
    history.replaceState(null, "", s ? `?${s}` : location.pathname);
  }

  function matches(p, words) {
    if (!words.length) return true;
    const hay = [p.title, p.subject, p.course, p.description, ...p.authors, ...p.formats, ...p.tags]
      .join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  }

  function renderChips(bySearch) {
    const counts = {};
    for (const p of bySearch) counts[p.subject] = (counts[p.subject] || 0) + 1;
    const present = subjectOrder.filter((s) => counts[s] || s === state.subject);
    const items = [["All", bySearch.length], ...present.map((s) => [s, counts[s] || 0])];
    chips.innerHTML = items.map(([name, n]) => `
      <button type="button" class="chip" data-subject="${esc(name)}" aria-pressed="${name === state.subject}">
        ${esc(name)} <span class="n">${n}</span>
      </button>`).join("");
  }

  function card(p) {
    const c = colorOf[p.subject] || "gray";
    const ext = !p.hosted;
    const authors = p.authors.join(", ");
    return `
      <a class="card" href="${esc(p.href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>
        <div class="card-top">
          <span class="badge" style="--c:var(--${c});--cb:var(--${c}-bg)">${esc(p.subject)}</span>
          ${p.course ? `<span class="course">${esc(p.course)}</span>` : ""}
        </div>
        <h2>${esc(p.title)}</h2>
        <p class="desc">${esc(p.description)}</p>
        <ul class="formats" aria-label="Formats">${p.formats.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <div class="card-foot">
          <span>by ${esc(authors)}</span>
          <span class="open">${ext ? "Open on Claude ↗" : "Open →"}</span>
        </div>
      </a>`;
  }

  function render() {
    const words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    const bySearch = projects.filter((p) => matches(p, words));
    const shown = bySearch.filter((p) => state.subject === "All" || p.subject === state.subject);

    const sorters = {
      new: (a, b) => b.added.localeCompare(a.added) || a.title.localeCompare(b.title),
      az: (a, b) => a.title.localeCompare(b.title),
      subject: (a, b) => subjectOrder.indexOf(a.subject) - subjectOrder.indexOf(b.subject) || a.title.localeCompare(b.title),
    };
    shown.sort(sorters[state.sort] || sorters.new);

    renderChips(bySearch);
    grid.innerHTML = shown.map(card).join("");
    empty.hidden = shown.length > 0;
    syncUrl();
  }

  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.subject = b.dataset.subject;
    render();
  });
  q.addEventListener("input", () => { state.q = q.value.trim(); render(); });
  sortSel.addEventListener("change", () => { state.sort = sortSel.value; render(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); }
  });

  fetch("catalog.json", { cache: "no-cache" })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((data) => {
      const { site } = data;
      projects = data.projects;
      subjectOrder = site.subjects.map((s) => s.name);
      colorOf = Object.fromEntries(site.subjects.map((s) => [s.name, s.color]));

      $("club").textContent = site.club;
      $("club-foot").textContent = site.club;
      $("tagline").textContent = site.tagline;
      const guide = `${site.repoUrl}/blob/main/CONTRIBUTING.md`;
      $("contribute").href = guide;
      $("empty-link").href = guide;

      const subjects = new Set(projects.map((p) => p.subject)).size;
      stats.textContent = `${projects.length} tools across ${subjects} subjects`;

      q.value = state.q;
      sortSel.value = state.sort;
      render();
    })
    .catch(() => {
      error.hidden = false;
      error.innerHTML = `<p><strong>Couldn't load the catalog.</strong></p>
        <p>Previewing locally? Run <code>node scripts/build-catalog.mjs</code>, then <code>python3 -m http.server</code>, and open <code>http://localhost:8000</code>.</p>`;
    });
})();
