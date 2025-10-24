# Code Explainer Test UI

This project is a Vite-powered React application styled with Tailwind CSS. It ships with hot module replacement, production builds, ESLint, and a cinematic landing experience for the **Code Explainer** AI assistant. The main screen combines a neon-inspired editor, AI explanation panels, and authentication forms to match the concept in the provided design reference.

## Prerequisites

- Node.js 18.0 or newer (LTS recommended)
- npm 9.0 or newer

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on the port reported by Vite (defaults to `http://localhost:5173`). Changes in `src` reload automatically.

## Available Scripts

- `npm run dev` – start the Vite development server with hot reloading.
- `npm run build` – create an optimized production build in `dist/`.
- `npm run preview` – serve the production build locally.
- `npm run lint` – lint the project with ESLint.

## Tailwind CSS Setup

Tailwind is configured via `tailwind.config.js` with content scanning for `index.html` and all files in `src/`. The global stylesheet (`src/index.css`) imports Tailwind layers and defines a small base theme. Customize styles by editing `tailwind.config.js` or adding component classes directly in your JSX.

## Key Features

- Immersive hero section with animated gradient accents and metric cards.
- Lightweight code editor powered by `react-simple-code-editor` with a custom Prism theme.
- Multi-language switcher (Python, JavaScript, React JSX) with per-language snippet state.
- AI explanation mock panels that show both summaries and line-by-line insights.
- Light/dark theme toggle that persists preference in `localStorage`.
- Login and registration forms with tabbed navigation to illustrate onboarding flow.

## Folder Highlights

- `src/App.jsx` – Complete Code Explainer layout featuring editor, AI output, and auth cards.
- `src/index.css` – Tailwind layer imports and base styles.
- `src/styles/prism-theme.css` – Custom Prism color scheme aligned with the neon UI.
- `postcss.config.js` – enables Tailwind and Autoprefixer during builds.

Feel free to expand on this foundation to meet your project’s needs.
