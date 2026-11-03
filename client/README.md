## Run locally

Open `http://localhost:4173`. To create a production build:

```sh
npm run build
npm run dev
```

## Stack and structure

- React 19, functional components, hooks and lazy-loaded secondary pages.
- React Router 7 with BrowserRouter, nested layout routes, NavLink active state, dynamic case-study routes, and a 404 page.
- Tailwind CSS 4 through the Vite integration, with shared custom theme tokens and bespoke responsive styling.
- Lucide icons, Vite 6, no UI framework, no external fonts or analytics.

| File | Purpose |
| --- | --- |
| `src/main.jsx` | App entry point, route definitions and route-level code splitting |
| `src/components/Layout.jsx` | Shared identity, accessible navigation, footer and reusable elements |
| `src/data/portfolio.js` | Profile, project case studies, experience and skills |
| `src/pages/` | Six required pages, project details and 404 page |
| `src/styles.css` | Tailwind import, theme, layout, responsive and interaction styles |
| `public/images/` | Portrait and original project architecture diagrams |
| `public/documents/` | Downloadable résumé PDF |
| `public/_redirects` | SPA fallback for compatible static hosts |
| `vercel.json` | SPA rewrites for Vercel |
