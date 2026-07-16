# React Anti-Patterns Playground

Interactive Wrong / Right demos of common **client React** anti-patterns. Hosted as a static Vite build on this GitHub Pages site.

## Local development

```bash
cd react-mistakes
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173/react-mistakes/dist/).

## Production build (required for GitHub Pages)

```bash
npm run build
```

This writes to `dist/`. That folder is **committed** so Pages can serve:

`https://<your-username>.github.io/react-mistakes/dist/`

Hash routes: `/react-mistakes/dist/#/mistakes/<slug>?mode=wrong|right`

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Preview the production build locally |

## Structure

- `src/lib/mistakes.ts` — catalog (`live` vs `explain`)
- `src/lib/registry.tsx` — slug → Wrong/Right demos
- `src/components/MistakeShell.tsx` — shared toggle shell
- `src/demos/*` — per-category demo modules

No Nest or Next — client React only.
