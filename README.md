# CodeNest

A developer hub for publishing and organising your engineering projects.
React + Vite frontend, Express + MongoDB API, JWT authentication.

## Requirements

- **Node.js 18+** (tested on 22)
- **MongoDB** running locally, or a MongoDB Atlas connection string

## Setup

Install both workspaces:

```bash
npm run install:all
```

Create the API environment file from the template:

```bash
cp backend/.env.example backend/.env
```

`JWT_SECRET` is required — the server refuses to start without it. Generate one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The frontend reads its API URL from `frontend/.env`, which already defaults to
`http://localhost:5000`. Copy `frontend/.env.example` if it is missing.

> **Note:** `.env` files are gitignored. Never commit real secrets.

## Running

Both servers together:

```bash
npm run dev
```

- Frontend — http://localhost:5173
- API — http://localhost:5000

Individually: `npm run start:frontend` / `npm run start:backend`.

## Testing

```bash
npm test          # from the repo root
```

Integration tests run against an in-memory MongoDB, so no local database is
needed. They cover registration, login, NoSQL injection rejection, rate
limiting, project CRUD, and cross-user ownership enforcement.

Lint the frontend:

```bash
npm run lint      # from the repo root
```

## API

All `/api/projects` routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | — | Create an account; returns a token |
| `POST` | `/api/auth/login` | — | Sign in; returns a token |
| `GET` | `/api/auth/me` | ✓ | Current user |
| `GET` | `/api/projects` | ✓ | List your projects (`?q=`, `?page=`, `?limit=`) |
| `POST` | `/api/projects` | ✓ | Create a project |
| `GET` | `/api/projects/:id` | ✓ | Read one of your projects |
| `PATCH` | `/api/projects/:id` | ✓ | Update a project |
| `DELETE` | `/api/projects/:id` | ✓ | Delete a project |
| `GET` | `/health` | — | Liveness and database status |

Auth endpoints are rate limited to 10 attempts per 15 minutes per IP.

## Environment variables

**backend/.env**

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `JWT_SECRET` | **yes** | — | Token signing key; server exits if unset |
| `MONGO_URI` | no | `mongodb://localhost:27017/codenest` | Database connection |
| `PORT` | no | `5000` | API port |
| `CLIENT_URL` | no | `http://localhost:5173` | Allowed CORS origin |
| `AUTH_RATE_LIMIT_MAX` | no | `10` | Auth attempts per window |

**frontend/.env**

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_API_URL` | no | `http://localhost:5000` | API base URL |

## Project structure

```
backend/
  app.js            Express app (mounted by server.js, imported by tests)
  server.js         Startup: env checks, DB connection, listen, shutdown
  middleware/auth.js
  models/           User, Project
  routes/           auth, projects
  test/             Integration tests (in-memory MongoDB)
frontend/
  src/lib/api.js       Shared axios instance + auth interceptors
  src/context/         Auth state (provider + hook)
  src/components/      Navbar, Hero, Features, Projects, Footer,
                       ProjectForm, RequireAuth, ErrorBoundary, PageLoader
  src/pages/           Home, Login, Register, Dashboard, NotFound
```

## Tech stack

React 19 · Vite 7 · Tailwind CSS 4 · React Router 7 · Express 5 · Mongoose 9 ·
JWT · bcrypt · Helmet

Tailwind v4 is configured CSS-first in `src/index.css` via `@theme` — there is
no `tailwind.config.js`.

## Not built yet

Public project pages, an explore feed, developer profiles, and password reset.
Footer links for unbuilt sections are marked "Soon" rather than pointing at
routes that do not exist.

## License

MIT — see [LICENSE](LICENSE).
