#!/usr/bin/env python3
"""Generate public and standalone Core learner hosts from one neutral template."""
from __future__ import annotations

import argparse
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]

HOSTS = {
    "public/core-learning/index.html": {
        "data_src": "./data.js",
        "runtime_base": "../js/core-learning",
        "portable_base": "../portable-workbench",
    },
    "standalone/core-learning/index.html": {
        "data_src": "../../public/core-learning/data.js",
        "runtime_base": "../../public/js/core-learning",
        "portable_base": "../../public/portable-workbench",
    },
}

TEMPLATE = r'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Core learner</title>
  <style>
    :root{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:light dark}
    body{margin:0;padding:clamp(.75rem,2vw,1.5rem);background:Canvas;color:CanvasText;font-size:clamp(1rem,.96rem + .2vw,1.08rem);line-height:1.5}
    main{max-width:82rem;margin:0 auto;display:grid;gap:1.2rem}
    .chooser{display:grid;gap:.7rem;border-bottom:2px solid currentColor;padding:.25rem 0 1rem}
    .chooser h1{margin:.1rem 0;font-size:clamp(1.45rem,1.2rem + 1vw,2rem)}
    .chooser-row{display:flex;flex-wrap:wrap;gap:.8rem;align-items:end}
    label{display:grid;gap:.4rem;min-width:min(100%,30rem);flex:1;font-weight:650}
    select,button{font:inherit;min-height:3rem} select{padding:.5rem .6rem} button{padding:.55rem .9rem}
    [data-status]{margin:0;font-size:.92rem}
    .explorer-panel{display:grid;gap:.6rem;border:1px solid color-mix(in srgb,currentColor 24%,transparent);border-radius:1rem;padding:1rem}
    .explorer-panel h2{margin:.1rem 0;font-size:1.15rem}
    .explorer-frame{width:100%;min-height:30rem;border:1px solid color-mix(in srgb,currentColor 24%,transparent);border-radius:.75rem;background:Canvas}
    [hidden]{display:none!important}
    @media (max-width:36rem){body{padding:.6rem}.explorer-panel{padding:.75rem}.explorer-frame{min-height:34rem}}
    @media print{.chooser,.explorer-panel{display:none!important}body{padding:0}}
  </style>
</head>
<body>
  <main>
    <section class="chooser" aria-labelledby="projection-title">
      <h1 id="projection-title">Core learner</h1>
      <div class="chooser-row">
        <label>
          Compiled learning activity
          <select id="projection-select" aria-describedby="projection-status"></select>
        </label>
        <button id="load-projection" type="button">Load</button>
      </div>
      <p id="projection-status" data-status role="status" aria-live="polite"></p>
      <details id="availability-panel" hidden>
        <summary>Unavailable or held activities</summary>
        <ul id="availability-list"></ul>
      </details>
    </section>
    <section class="explorer-panel" id="explorer-panel" aria-labelledby="explorer-title" hidden>
      <h2 id="explorer-title">Interactive scientific representation</h2>
      <iframe id="explorer-frame" class="explorer-frame" title="Interactive scientific representation"></iframe>
    </section>
    <core-learning-page id="learner"></core-learning-page>
  </main>

  <script src="__CORE_DATA_SRC__"></script>
  <script type="module">
    import "__CORE_RUNTIME_BASE__/semantic-workbench.mjs";
    import "__CORE_RUNTIME_BASE__/core-learning-page.mjs";
    import { mountCoreLearningPage } from "__CORE_RUNTIME_BASE__/core-learning-host.mjs";

    const data = window.GRADE9V3_CORE;
    const rows = Array.isArray(data?.core_projections) ? data.core_projections : [];
    const availability = Array.isArray(data?.bucket_availability) ? data.bucket_availability : [];
    const learner = document.getElementById("learner");
    const select = document.getElementById("projection-select");
    const loadButton = document.getElementById("load-projection");
    const status = document.getElementById("projection-status");
    const availabilityPanel = document.getElementById("availability-panel");
    const availabilityList = document.getElementById("availability-list");
    const explorerPanel = document.getElementById("explorer-panel");
    const explorerFrame = document.getElementById("explorer-frame");
    const baseRegistries = window.CORE_LEARNING_REGISTRIES || {};

    function labelFor(row) {
      const core = row?.projection?.core || "Core";
      const source = row?.source_ref || row?.id || "activity";
      return [row?.subject, core, source].filter(Boolean).join(" · ");
    }

    function setStatus(message) { status.textContent = message; }

    async function loadPortablePackages() {
      try {
        const catalogResponse = await fetch("__PORTABLE_BASE__/catalog.json");
        if (!catalogResponse.ok) return [];
        const catalog = await catalogResponse.json();
        const ids = Array.isArray(catalog?.packageIds) ? catalog.packageIds : [];
        const packages = await Promise.all(ids.map(async (id) => {
          if (typeof id !== "string" || !id || id.includes("/") || id.includes("..")) return null;
          const response = await fetch("__PORTABLE_BASE__/packages/" + encodeURIComponent(id) + ".json");
          return response.ok ? response.json() : null;
        }));
        return packages.filter(Boolean);
      } catch (_) {
        return [];
      }
    }

    const portablePackagesPromise = loadPortablePackages();

    function renderAvailability() {
      const unavailable = availability.filter((row) =>
        row?.status === "UNSUPPORTED" || (Array.isArray(row?.findings) && row.findings.length)
      );
      availabilityPanel.hidden = unavailable.length === 0;
      availabilityList.replaceChildren();
      for (const row of unavailable) {
        const item = document.createElement("li");
        const finding = Array.isArray(row.findings) && row.findings.length ? row.findings[0] : row;
        const code = finding?.code || "UNAVAILABLE";
        const detail = finding?.detail ? ` — ${finding.detail}` : "";
        item.textContent = [row.subject, row.bucket_ref, code].filter(Boolean).join(" · ") + detail;
        availabilityList.append(item);
      }
    }

    function explorerUrl(locator) {
      if (typeof locator !== "string" || !locator.startsWith("public/") || locator.includes("..")) return null;
      return new URL("../../" + locator, window.location.href).href;
    }

    function mountExplorer(row) {
      const url = explorerUrl(row?.explorer_locator);
      explorerPanel.hidden = !url;
      if (url) explorerFrame.src = url;
      else explorerFrame.removeAttribute("src");
    }

    async function mount(id, { updateUrl = true } = {}) {
      try {
        const row = rows.find((item) => item.id === id);
        const portablePackages = await portablePackagesPromise;
        const registries = { ...baseRegistries, portablePackages };
        const result = mountCoreLearningPage(learner, data, id, registries);
        select.value = result.id;
        mountExplorer(row);
        const portable = result.portablePackageId ? ` · in-page visual ${result.portablePackageId}` : "";
        setStatus(`Loaded ${labelFor(row)}${portable}.`);
        if (updateUrl) {
          const url = new URL(window.location.href);
          url.searchParams.set("projection", result.id);
          history.replaceState(null, "", url);
        }
      } catch (error) {
        const code = error?.code || error?.name || "CORE_LEARNING_LOAD_FAILED";
        setStatus(`Unable to load activity: ${code}.`);
      }
    }

    for (const row of rows) {
      if (!row || typeof row.id !== "string" || !row.id) continue;
      const option = document.createElement("option");
      option.value = row.id;
      option.textContent = labelFor(row);
      select.append(option);
    }

    renderAvailability();

    if (!select.options.length) {
      select.disabled = true;
      loadButton.disabled = true;
      const first = availability.find((row) => row?.status === "UNSUPPORTED");
      const reason = first?.code ? ` Reason: ${first.code}.` : "";
      setStatus("No compiled Core learner projections are available in this generated data build." + reason);
    } else {
      loadButton.addEventListener("click", () => mount(select.value));
      select.addEventListener("change", () => setStatus(`Selected ${labelFor(rows.find((row) => row.id === select.value))}.`));
      const requested = new URL(window.location.href).searchParams.get("projection");
      if (requested && rows.some((row) => row.id === requested)) mount(requested, { updateUrl: false });
      else if (requested) {
        select.value = rows[0].id;
        setStatus("Requested projection was not found. Select an available compiled activity.");
      } else mount(rows[0].id);
    }

    window.__coreLearningStaticHostReady = true;
  </script>
</body>
</html>
'''


def render_host(*, data_src: str, runtime_base: str, portable_base: str) -> bytes:
    rendered = (
        TEMPLATE
        .replace("__CORE_DATA_SRC__", data_src)
        .replace("__CORE_RUNTIME_BASE__", runtime_base)
        .replace("__PORTABLE_BASE__", portable_base)
    )
    if any(token in rendered for token in ("__CORE_DATA_SRC__", "__CORE_RUNTIME_BASE__", "__PORTABLE_BASE__")):
        raise ValueError("CORE_LEARNING_HOST_TEMPLATE_UNRESOLVED")
    return rendered.encode("utf-8")


def render() -> dict[str, bytes]:
    return {
        relative: render_host(
            data_src=config["data_src"],
            runtime_base=config["runtime_base"],
            portable_base=config["portable_base"],
        )
        for relative, config in HOSTS.items()
    }


def write() -> dict[str, bytes]:
    rendered = render()
    for relative, content in rendered.items():
        path = REPO / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
    return rendered


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate or verify Core learner hosts")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = render()
    if args.check:
        stale = [
            relative for relative, content in rendered.items()
            if not (REPO / relative).is_file() or (REPO / relative).read_bytes() != content
        ]
        for relative in stale:
            print(f"generated file is stale: {relative}")
        return 1 if stale else 0
    write()
    for relative in sorted(rendered): print(f"wrote {relative}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
