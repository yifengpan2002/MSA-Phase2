# Orbit — frontend setup

Drop the `src/` folder into a fresh Vite project, then follow the setup below.

## 1. Create the project

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install react-router-dom zustand
npm install -D tailwindcss @tailwindcss/vite
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Copy the `src/` folder from this bundle over the generated one.

## 2. `vite.config.ts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
```

Importing `defineConfig` from `vitest/config` (not `vite`) is what makes the `test`
block type-check.

## 3. `src/setupTests.ts`

```ts
import "@testing-library/jest-dom";
```

## 4. `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## 5. Fonts — add to `index.html` inside `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Karla:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

## 6. `.env`

```
VITE_API_URL=http://localhost:5000/api
```

Create a `.env.production` later with your deployed API URL. Add `.env` to `.gitignore`.

## 7. Add scripts to `package.json`

```json
"test": "vitest run",
"test:watch": "vitest"
```

Run `npm run dev` and `npm run test`.

---

## The design system

Everything lives in `src/index.css`. Change a value there and the whole app follows.

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `paper` | `#e9ebe4` | `#10161c` | Page background |
| `surface` | `#f5f6f1` | `#18212a` | Cards, panels |
| `ink` | `#131a22` | `#e6e9e4` | Text |
| `muted` | `#5c6670` | `#94a0ab` | Secondary text |
| `rule` | `#c9cdc4` | `#2a343d` | Hairlines |
| `energy` | `#1f8a70` | `#35a98b` | Energy, primary actions |
| `ember` | `#c98f16` | `#e8b93f` | Points, streaks, warnings |

**Typefaces.** Newsreader for display (literary, sets the writing tone), Karla for UI, JetBrains Mono for anything numeric or label-like. Numbers are always mono — energy, likes, entry numbers — so quantities read as instrument data.

**Signature.** The orbit ring. Stats are rings, the like button is a ring that fills, and the avatar/planet is a ring. It ties the reward loop to one shape you'll recognise anywhere in the app.

**Structure.** The forum is numbered like a logbook (`001`, `002`) and a ruled margin rail runs down wide screens. The numbering encodes something real — publication order — rather than decoration.

Dark mode is a class on `<html>`, so it costs one line of CSS per token instead of a second stylesheet.

---

## How the files fit together

```
src/
├── index.css              design tokens + dark mode + a11y floor
├── types.ts               shared shapes; mirror these in your C# DTOs
├── lib/
│   ├── session.ts         the only place that touches localStorage
│   └── api.ts             typed fetch wrapper, attaches the JWT, maps errors
├── store/
│   ├── useAuthStore.ts    Zustand — user, token, sign in/up/out, energy
│   └── useThemeStore.ts   Zustand — light/dark
├── components/
│   ├── AppShell.tsx       header, nav, counters, theme toggle, reward banner
│   ├── ProtectedRoute.tsx redirects signed-out visitors to /login
│   └── OrbitStat.tsx      the ring stat
└── pages/
    ├── Login.tsx          sign in + create account, client-side validation
    ├── Forum.tsx          list, publish, like (optimistic), delete
    └── Profile.tsx        stats, bio edit, badges, planet slot, your stories
```

`session.ts` exists so `api.ts` never imports the store and the store never imports
`api.ts`'s internals — no circular imports, and both are easy to test.

---

## API contract this frontend expects

Build these in .NET next. Everything under `/api`.

| Method | Route | Returns |
|---|---|---|
| POST | `/auth/register` | `AuthResponse` |
| POST | `/auth/login` | `AuthResponse` — awards daily points, updates the streak |
| GET | `/users/me` | `User` |
| PUT | `/users/me` | `User` |
| GET | `/users/{id}/profile` | `ProfileSummary` |
| GET | `/posts?sort=new\|top` | `Post[]` |
| GET | `/posts/{id}` | `Post` |
| POST | `/posts` | `Post` |
| PUT | `/posts/{id}` | `Post` |
| DELETE | `/posts/{id}` | `204` |
| POST | `/posts/{id}/like` | `LikeResult` — toggles, credits energy to the author |

Two rules to enforce server-side, not in React: a writer can only claim points once per
UTC day, and only the first like from a given user on a given post pays out energy.
Client-side checks are convenience; the server is the source of truth.

---

## Requirement coverage so far

| Requirement | Where |
|---|---|
| React + TypeScript | Whole app, strict types, no `any` |
| Responsive UI | Mobile-first; login splits at `lg`, nav wraps, rail hides |
| Unique visual identity | Custom token system, no component library defaults |
| React Router | `App.tsx`, with a protected layout route |
| Frontend unit tests | `pages/Login.test.tsx` (Vitest + Testing Library) |
| **Advanced — state management** | Zustand in `store/` |
| **Advanced — theme switching** | `useThemeStore` + `.dark` token overrides |

Still to do: deploy the frontend, keep committing regularly, and add the third advanced
feature (security measures) on the backend.
