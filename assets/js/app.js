const catalogUrl = new URL("data/packages.json", document.baseURI);

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const packageInitials = (name) => name
  .replace(/[^a-z0-9]/gi, "")
  .slice(0, 2)
  .toUpperCase();

const showToast = (message) => {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  showToast("Repository URL copied");
};

const loadCatalog = async () => {
  const response = await fetch(catalogUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load package data (${response.status})`);
  }
  return response.json();
};

const applyRepositoryData = (repository, packageCount) => {
  document.querySelectorAll("[data-repository-url]").forEach((element) => {
    element.textContent = repository.url;
  });
  document.querySelectorAll("[data-repository-description]").forEach((element) => {
    element.textContent = repository.description;
  });
  document.querySelectorAll("[data-sileo-url]").forEach((element) => {
    element.href = repository.sileoUrl;
  });
  document.querySelectorAll("[data-github-url]").forEach((element) => {
    element.href = repository.githubUrl;
  });
  document.querySelectorAll("[data-package-count]").forEach((element) => {
    element.textContent = packageCount;
  });

  const copyButton = document.querySelector("[data-copy-repository]");
  copyButton?.addEventListener("click", () => copyText(repository.url));
};

const packageCard = (item) => {
  const badges = item.badges
    .map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`)
    .join("");
  const detailsUrl = `package.html?id=${encodeURIComponent(item.slug)}`;

  return `
    <article class="package-card" data-package-card data-search="${escapeHtml([
      item.name,
      item.identifier,
      item.description,
      item.badges.join(" ")
    ].join(" ").toLowerCase())}">
      <div class="package-card-top">
        <span class="package-icon" aria-hidden="true">${escapeHtml(packageInitials(item.name))}</span>
        <span class="version-pill">v${escapeHtml(item.version)}</span>
      </div>
      <h3><a href="${detailsUrl}">${escapeHtml(item.name)}</a></h3>
      <p class="package-identifier">${escapeHtml(item.identifier)}</p>
      <p class="package-description">${escapeHtml(item.description)}</p>
      <div class="badge-row">${badges}</div>
      <div class="package-actions">
        <a class="text-link" href="${detailsUrl}">View details →</a>
        <a class="text-link" href="${escapeHtml(item.downloadUrl)}" download>Download .deb</a>
      </div>
    </article>
  `;
};

const renderHome = (catalog) => {
  const grid = document.querySelector("[data-package-grid]");
  const search = document.querySelector("[data-package-search]");
  const emptyState = document.querySelector("[data-empty-state]");
  const packages = [...catalog.packages].sort((left, right) => {
    return Number(right.featured) - Number(left.featured) || left.name.localeCompare(right.name);
  });

  applyRepositoryData(catalog.repository, packages.length);
  grid.innerHTML = packages.map(packageCard).join("");

  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;

    grid.querySelectorAll("[data-package-card]").forEach((card) => {
      const visible = !query || card.dataset.search.includes(query);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount !== 0;
  });
};

const changelogMarkup = (entries) => entries.map((entry) => `
  <article class="release-entry">
    <div>
      <div class="release-version">Version ${escapeHtml(entry.version)}</div>
      <div class="release-date">${escapeHtml(entry.date)}</div>
    </div>
    <ul>
      ${entry.changes.map((change) => `<li>${escapeHtml(change)}</li>`).join("")}
    </ul>
  </article>
`).join("");

const renderPackage = (catalog) => {
  const container = document.querySelector("[data-package-detail]");
  const slug = new URLSearchParams(window.location.search).get("id");
  const item = catalog.packages.find((candidate) => candidate.slug === slug);

  applyRepositoryData(catalog.repository, catalog.packages.length);

  if (!item) {
    container.innerHTML = `
      <div class="load-error">
        <h1>Package not found</h1>
        <p>This package does not exist in the current repository catalog.</p>
        <a class="button button-secondary" href="./#packages">Back to packages</a>
      </div>
    `;
    return;
  }

  document.title = `${item.name} ${item.version} · ${catalog.repository.name}`;
  document.querySelector('meta[name="description"]')
    ?.setAttribute("content", item.description);

  const badges = item.badges
    .map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`)
    .join("");

  container.innerHTML = `
    <div class="detail-hero">
      <section class="detail-main">
        <div class="detail-heading">
          <span class="package-icon" aria-hidden="true">${escapeHtml(packageInitials(item.name))}</span>
          <div>
            <h1>${escapeHtml(item.name)}</h1>
            <p class="package-identifier">${escapeHtml(item.identifier)}</p>
          </div>
        </div>
        <p class="detail-description">${escapeHtml(item.description)}</p>
        <div class="badge-row">${badges}</div>
        <div class="detail-actions">
          <a class="button button-primary" href="${escapeHtml(catalog.repository.sileoUrl)}">Add repo to Sileo</a>
          <a class="button button-secondary" href="${escapeHtml(item.downloadUrl)}" download>Download .deb</a>
          <a class="button button-secondary" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer">Source code</a>
        </div>
      </section>

      <aside class="detail-sidebar">
        <h2>Package information</h2>
        <dl class="metadata-list">
          <div><dt>Version</dt><dd>${escapeHtml(item.version)}</dd></div>
          <div><dt>Architecture</dt><dd>${escapeHtml(item.architecture)}</dd></div>
          <div><dt>Section</dt><dd>${escapeHtml(item.section)}</dd></div>
          <div><dt>Compatibility</dt><dd>${escapeHtml(item.compatibility)}</dd></div>
        </dl>
        <p class="compatibility-note">${escapeHtml(item.tested)}</p>
      </aside>
    </div>

    <section class="changelog" aria-labelledby="changelog-title">
      <h2 id="changelog-title">Changelog</h2>
      ${changelogMarkup(item.changelog)}
    </section>
  `;
};

const renderLoadError = (error) => {
  console.error(error);
  const container = document.querySelector("[data-package-grid], [data-package-detail]");
  if (container) {
    container.innerHTML = '<p class="load-error">Package data could not be loaded. Please refresh the page.</p>';
  }
};

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

loadCatalog()
  .then((catalog) => {
    if (document.body.dataset.page === "package") {
      renderPackage(catalog);
    } else {
      renderHome(catalog);
    }
  })
  .catch(renderLoadError);
