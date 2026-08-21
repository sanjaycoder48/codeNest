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

Public GitHub repositories work without configuration. Copy the environment templates only when you need authenticated GitHub limits, saved accounts/projects, or a different API origin.

## Verification

```bash
cd backend && npm test
cd ../frontend && npm run lint
cd ../frontend && npm run build
```

## GitHub Pages

Pushes to `main` automatically build and publish the frontend through the
`Deploy Project Twin to GitHub Pages` workflow. The published interface is
available at `https://sanjaycoder48.github.io/codeNest/` after GitHub Pages is
configured to use GitHub Actions as its source.

GitHub Pages serves static files only. Live repository analysis requires the
Express backend to be deployed separately and its public URL supplied as the
frontend `VITE_API_URL` build variable.

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
