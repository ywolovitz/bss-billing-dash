# Month-End Billing Run — Status Dashboard

A static, GitHub Pages–ready dashboard for tracking month-end billing run progress, plus a hidden configuration panel for updating it.

## Files

- `index.html` — the stakeholder-facing dashboard (read-only).
- `config.html` — the configuration panel. **Not linked from `index.html`** — only reachable if someone has the direct URL.
- `data.json` — the single source of truth for all statuses, times, quantities and notes. Both pages read this file.
- `items.js` — the structure of the dashboard (labels, fields, groups). Edit this only if the actual billing process changes (e.g. a new check is added).
- `style.css` — shared styling.

## Deploying

1. Push this folder to a GitHub repo.
2. In **Settings → Pages**, set the source to the branch/folder containing these files.
3. Your dashboard will be live at `https://<your-username>.github.io/<repo>/index.html`.
4. The config panel will be at `https://<your-username>.github.io/<repo>/config.html` — treat that URL as the access control, since there's no login. Only share it with whoever is allowed to update the run status.

## How updating works (important — read this)

GitHub Pages only serves static files; there's no database behind it. So:

- `config.html` lets you edit every status, time, quantity and note in a form, and can **save a draft in your own browser** (via `localStorage`) so you don't lose work if you close the tab.
- A draft is **only visible in the browser you made it in**. It does **not** update what other stakeholders see.
- To actually publish a change to everyone viewing the dashboard, click **"Generate updated data.json"** in the config panel, then **Download** (or copy) the file, replace `data.json` in your repo, and commit + push. GitHub Pages will pick it up automatically (usually within a minute).

This is the standard way to run a "configurable" dashboard on a static host with no backend. If at some point you want true real-time multi-user editing (no download/commit step), that needs a small backend or a service like Firebase/Supabase — happy to help with that later if it becomes worth it.

## Editing the structure

If a new step gets added to the billing run (e.g. a new check or a new business unit), add it to `ITEM_DEFS` in `items.js` and add a matching entry under `items` in `data.json`. Both pages will pick it up automatically — no other code changes needed for `time`, `checks` or `dimensions` type items.
