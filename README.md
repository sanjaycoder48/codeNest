# Project Twin

Project Twin turns a GitHub repository into a living, evidence-grounded model of the project. It classifies repository files, extracts deterministic metadata, builds architecture context, scores production readiness, recommends contextual improvements, diagnoses deployment configuration failures, and generates an editable public showcase.

## What works

- Asynchronous public GitHub repository import and analysis
- File classification for components, pages, routes, models, configuration, and documentation
- Dependency, framework, language, environment-variable name, and API route extraction
- Weighted production-readiness checks with evidence, severity, risk, and confidence
- Contextual upgrade recommendations and an approval-gated sandbox flow
- Deployment Doctor flow that never reads or displays secret values
- Editable showcase generation and evidence-aware Ask Project Twin answers
- Responsive, accessible developer workspace with loading, empty, error, and success states

Repository code is treated as untrusted input. The analyzer reads a limited set of relevant text files through the GitHub API and does not execute imported code.

## Run locally

Install dependencies once:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

Start the frontend and backend together from the repository root:

```bash
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:5000`.

Public GitHub repositories work without configuration. Copy the environment
templates when you need authenticated GitHub limits, saved accounts/projects, or
a different API origin:

```bash
cp backend/.env.example backend/.env
```

`JWT_SECRET` is required — the API exits immediately if it is missing rather
than falling back to a guessable value. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

MongoDB is optional. Repository analysis runs without it; only authentication
and saved projects need a database. `GET /health` reports connection state.

## Verification

```bash
cd backend && npm test
cd ../frontend && npm run lint
cd ../frontend && npm run build
```

The backend suite runs against an in-memory MongoDB, so no local database is
required. It covers registration, login, NoSQL-operator rejection, rate
limiting, project CRUD, cross-user ownership enforcement, and the repository
analyzer.

## Environment variables

**backend/.env**

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `JWT_SECRET` | **yes** | — | Token signing key; the server exits if unset |
| `MONGO_URI` | no | `mongodb://localhost:27017/codenest` | Database connection |
| `PORT` | no | `5000` | API port |
| `CLIENT_URL` | no | `http://localhost:5173` | Comma-separated CORS allowlist |
| `GITHUB_TOKEN` | no | — | Raises GitHub API limits; never sent to the browser |
| `AUTH_RATE_LIMIT_MAX` | no | `10` | Auth attempts per IP per 15 minutes |
| `TRUST_PROXY` | no | — | Proxy hop count, so rate limiting sees the real client IP |

**frontend/.env**

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_API_URL` | no | *(empty)* | API origin; empty runs analysis in the browser |

`.env` files are gitignored. Never commit real secrets.

## GitHub Pages

Pushes to `main` automatically build and publish the frontend through the
`Deploy Project Twin to GitHub Pages` workflow. The published interface is
available at `https://sanjaycoder48.github.io/codeNest/` after GitHub Pages is
configured to use GitHub Actions as its source.

GitHub Pages serves static files only. Live repository analysis requires the
Express backend to be deployed separately and its public URL supplied as the
frontend `VITE_API_URL` build variable. When you do that, add the Pages origin
to the backend `CLIENT_URL` allowlist or the browser will block the requests.

## Deploying the backend

The frontend on Pages is static. Server-side analysis, accounts and saved
projects need the API deployed somewhere that runs Node.

```bash
docker build -t project-twin-api ./backend
docker run -p 5000:5000 --env-file backend/.env project-twin-api
```

The image installs production dependencies only, runs as a non-root user, and
declares a healthcheck against `/health`. On Render, Railway or Fly, point the
platform at `backend/Dockerfile` and set:

| Setting | Value |
| --- | --- |
| `JWT_SECRET` | a fresh 48-byte random value |
| `CLIENT_URL` | `https://sanjaycoder48.github.io` (plus any other origins) |
| `TRUST_PROXY` | `1` — these platforms terminate TLS at a proxy |
| `GITHUB_TOKEN` | optional, raises the GitHub rate limit |
| `MONGO_URI` | optional, only for accounts and saved projects |

Then rebuild the frontend with `VITE_API_URL` pointing at the deployed API.
Without `TRUST_PROXY`, every request appears to come from the proxy and all
clients share a single rate-limit bucket.

### Known limits before real traffic

- Analysis jobs live in memory, bounded by `ANALYSIS_MAX_JOBS` and
  `ANALYSIS_JOB_TTL_MS`. They do not survive a restart, and with more than one
  instance a polling client can hit a replica that never saw the job. Running a
  single instance is fine; scaling out needs a shared store.
- There is no error-tracking integration. Failures are logged to stdout only.

## Architecture

```text
React workspace
      |
      v
Express analysis API -> asynchronous in-memory analysis jobs
      |
      v
GitHub metadata/tree/blob APIs -> deterministic Project Twin model
      |
      +-> readiness checks
      +-> upgrade recommendations
      +-> deployment diagnosis
      +-> evidence-aware answers
```

The current hackathon foundation keeps analysis jobs in memory and retains the existing Mongo-backed account routes. The next production step is moving users, projects, analysis jobs, audit events, and Project Twin snapshots to PostgreSQL with a durable worker queue. Preview deployment is represented as an approval-gated provider workflow; connecting a deployment account and isolated build runner is required before it can publish a real URL.

## Security boundaries

- Imported repositories are never executed by the application server.
- Only environment variable names and source locations are extracted.
- Secret values are not requested, stored in Project Twin, or shown publicly.
- Code changes, pull requests, environment updates, production deployments, and showcase publishing require explicit approval in the interface.
- Private repository access uses the server-side `GITHUB_TOKEN`; it is never sent to the browser.

## API hardening

The account API applies these regardless of which interface calls it:

- Credentials are type-checked, so query operators cannot reach a filter; Mongoose `sanitizeFilter` is enabled as a second layer.
- Auth endpoints are rate limited per IP.
- `helmet` sets security headers; CORS uses an explicit origin allowlist.
- Passwords are bcrypt-hashed and never serialised in a response.
- Project routes scope every read, update, and delete to the owning user.
- Errors are logged server-side and returned as generic messages.

## License

MIT — see [LICENSE](LICENSE).
