# Sprint Hub Agent Guide

## Purpose

Sprint Hub is a lightweight internal web app for weekly technical leadership follow-up.

It is **not** a replacement for Azure DevOps or detailed squad sprint control.

Its real role is:

- track weekly demand at a higher level
- summarize progress across projects
- expose blockers, risks, and dependencies
- support discussions among technical leaders
- keep the canonical information close to the markdown notes already used by the team

## Product Scope

### In scope

- sprint-level tracking from `tech/sprints/*.md`
- project-level aggregation into `projects/<project>/sprints.md`
- backlog intake via `tech/backlog.json`
- project timelines via `projects/<project>/timeline.md`
- team notes in `tech/team/*.md`
- PJs monthly control via `tech/pjs.md`
- direct editing of markdown files under `projects/`

### Out of scope

- detailed squad execution management
- story points, burndown, velocity, workflow engines
- replacing Azure DevOps boards
- multi-user auth, permissions, audit trail
- robust API backend or database persistence

## Current Technical Shape

The app is intentionally simple:

- frontend: plain `index.html` + `styles.css` + `app.js`
- backend: `server.py` using Python stdlib `http.server`
- persistence: markdown and JSON files in the repository

This makes the project very easy to run and change, but it also means the code is tightly coupled to:

- DOM element IDs
- file/folder naming conventions
- markdown parsing rules
- a single large frontend script

## Repository Areas Used by Sprint Hub

- `sprint-hub/index.html`: app structure and modal markup
- `sprint-hub/styles.css`: design system and page layout
- `sprint-hub/app.js`: all frontend state, rendering, parsing, persistence calls
- `sprint-hub/server.py`: file-serving and JSON API layer
- `tech/sprints/*.md`: main sprint source of truth
- `tech/backlog.json`: backlog persistence
- `projects/<name>/sprints.md`: generated view derived from sprint files
- `projects/<name>/timeline.md`: per-project executive timeline
- `tech/team/*.md`: team members and editable notes
- `tech/métricas.md`: team metrics reference
- `tech/pjs.md`: PJ payment control

## Runbook

### Start in file mode

```bash
python sprint-hub/server.py
```

Open:

```text
http://127.0.0.1:8765
```

### Fallback mode

If `index.html` is opened directly without the server, the app falls back to `localStorage`.

This is useful only for UI exploration. It is not the main operating mode.

## Main Data Model

### Sprint

- `name`
- `goal`
- `fileName`
- `topics[]`

Mapped from markdown in `tech/sprints/*.md`.

### Topic / Project Card

This is the main unit in the weekly board.

- `title`
- `projectKey`
- `status`
- `description`
- `items[]`

### Item / Task

Tasks are intentionally generic and leadership-oriented.

- `text`
- `done`
- `responsibles[]`
- `priority` (`normal` or `high`)
- `blocked`
- `blockedReason`

These are not intended to replicate DevOps work items in detail.

### Backlog Item

Stored in `tech/backlog.json`.

Used as a lightweight intake/parking area before something becomes part of a sprint.

### Timeline Event

Stored in `projects/<project>/timeline.md`.

- `date`
- `name`
- `description`

Use this for relevant project events worth revisiting later.

## Frontend Architecture

All frontend logic lives in `app.js`.

### Key responsibilities handled there

- DOM element binding
- local in-memory state
- markdown parsing and formatting
- API calls
- rendering of board, backlog, team, timelines and modals
- drag/drop task movement
- autosave orchestration
- localStorage fallback

### Important implication

Because there is no component architecture, changing markup IDs in `index.html` can easily break `app.js`.

Any UI change should be validated against:

- element lookup in `const el = { ... }`
- event listeners at the bottom of `app.js`
- renderer functions that assume specific DOM structure

## Backend Architecture

`server.py` does three things:

1. serves static files from `sprint-hub/`
2. exposes JSON endpoints for the app
3. reads/writes markdown and JSON files in the repo

It is intentionally minimal and synchronous.

### Notable behavior

- `projects/<project>/sprints.md` is regenerated when sprint files are saved
- `projects/<project>/timeline.md` is ensured automatically
- backlog is returned together with sprint files
- all writes normalize line endings to `\n`

## Key API Endpoints

### Read

- `GET /api/sprint-files`
- `GET /api/pjs`
- `GET /api/team-members`
- `GET /api/team-metrics`
- `GET /api/team-member/file?path=...`
- `GET /api/projects/tree`
- `GET /api/projects/file?path=...`

### Write

- `POST /api/sprint-files/save-all`
- `POST /api/pjs/save`
- `POST /api/projects/file/save`
- `POST /api/projects/folder/create`
- `POST /api/projects/file/create`
- `POST /api/projects/file/delete`
- `POST /api/team-members/save`
- `POST /api/team-member/file/save`
- `POST /api/team-member/file/create`
- `POST /api/team-member/file/delete`

## Markdown Conventions

### Sprint files

Expected structure:

```md
# Sprint 26-19

Goal: Example goal

## Project Name [project:folder-name]
- [ ] Item text (Gui + Fel) [HIGH]
- [ ] Blocked item [BLOCKED: waiting for dependency]
```

### Timeline files

Expected structure:

```md
# Timeline - Project Name

## 2026-05-11 - Important event
Short description
```

### Team files

Member parsing currently depends on:

- first `# ` heading for member name
- `Nickname: ...`
- optional `Ativo: ...`

## Process Guidance

### How leaders should use it

- create or update only the meaningful weekly items
- prefer concise, leadership-readable task text
- use blocked reason for context, not a long thread
- use timeline for relevant events and milestones
- use backlog for items not yet ready to live inside a sprint

### How not to use it

- do not mirror all Azure DevOps items
- do not turn this into a detailed squad board
- do not overload project cards with execution-only noise

The best mental model is:

> one project card should be understandable by another tech leader in seconds

## Current Evaluation

### Strengths

- very low setup cost
- repo-native persistence
- easy to inspect and edit manually
- useful for leadership-oriented weekly review
- timeline and backlog broaden the tool beyond sprint-only tracking

### Weaknesses

- `app.js` is monolithic and carries too many responsibilities
- no automated tests
- no schema validation for markdown/JSON payloads
- UI and JS are tightly coupled
- state changes are easy to introduce regressions into
- no audit/history of who changed what

### Technical risks

- project-generated files like `projects/*/sprints.md` can create noisy git diffs
- manual edits to generated `sprints.md` may be overwritten by sprint sync
- the metrics path currently shows mojibake in Python source (`mÃ©tricas.md`), which should be normalized
- localStorage fallback can diverge from file mode during debugging if misunderstood

## Recommended Developer Workflow

### Before editing

1. start the server
2. inspect `index.html`, `styles.css`, `app.js`, `server.py`
3. check whether the change affects markdown parsing, rendering, or API endpoints
4. check git status because generated files may already be dirty

### When changing UI

Always verify:

- new IDs/classes are wired in `app.js`
- modal open/close flows still work
- board filters still render correctly
- mobile layout is not broken

### When changing persistence

Always verify:

- markdown round-trip parsing
- `save-all` behavior
- derived project file generation
- timeline and backlog compatibility

## Suggested Next Refactors

### High value

- split `app.js` into modules:
  - API
  - parsing/formatting
  - rendering
  - modal handling
  - state/autosave

- centralize markdown schemas and serializers
- add smoke tests for markdown parsing and formatting

### Product-fit improvements

- keep tasks generic and leadership-readable
- strengthen project status and summary views
- add better weekly snapshot/review affordances
- avoid drifting toward DevOps duplication

## Onboarding Checklist

For a new engineer or agent:

1. read this file
2. read `sprint-hub/README.md`
3. run the server locally
4. inspect one sprint markdown file in `tech/sprints/`
5. inspect one project folder in `projects/`
6. inspect one timeline file
7. inspect `tech/backlog.json`
8. open the UI and exercise:
   - sprint selection
   - project editing
   - task create/edit/block
   - backlog add/edit
   - timeline add/view
   - project file editor
   - team modal

## Practical Notes For Future Agents

- treat `tech/sprints/*.md` as the main business source of truth
- treat `projects/*/sprints.md` as generated artifacts
- avoid destructive git operations because the repo often contains useful local changes
- prefer minimal changes to DOM IDs because the frontend is ID-driven
- when unsure whether a file is generated, inspect how `server.py` writes it before editing
