# Sprint Hub Agent Guide

## Purpose

Sprint Hub is a lightweight internal app for high-level sprint and delivery follow-up.

It is not meant to replace Azure DevOps, squad boards, or detailed execution control.

Its role is to help technical leadership:

- review weekly progress quickly
- see project continuity across sprints
- track blockers and ownership
- organize backlog intake
- maintain a simple project knowledge area inside the repo

The current mental model is:

`project -> feature -> task`

This is a leadership view, not a full delivery system of record.

## Product Scope

### In scope

- sprint-level tracking from `tech/sprints/*.md`
- backlog intake from `tech/backlog.json`
- project continuity across sprints
- project status control
- feature catalog per project
- project timeline/history
- team notes and team metrics support
- PJ monthly control
- repo-native editing of project support files

### Out of scope

- detailed squad execution management
- story points, burndown, velocity
- workflow automation engines
- replacing Azure DevOps boards
- multi-user auth, permissions, or audit trail
- database-backed persistence

## Current Technical Shape

The app is intentionally simple:

- frontend: `index.html`, `styles.css`, `app.js`
- backend: `server.py` using Python stdlib `http.server`
- persistence: markdown and JSON files inside the repo

That simplicity makes iteration fast, but creates tight coupling around:

- DOM element IDs
- modal markup structure
- markdown parsing rules
- generated project support files
- one large frontend script that owns state, parsing, rendering, and persistence

## Repository Areas Used by Sprint Hub

- `sprint-hub/index.html`: page structure and modal markup
- `sprint-hub/styles.css`: design system, layout, taskboard, delivery visuals
- `sprint-hub/app.js`: app state, parsing, renderers, drag/drop, modal flows, autosave
- `sprint-hub/server.py`: static file host and JSON API
- `tech/sprints/*.md`: main source of truth for sprint/project/task content
- `tech/backlog.json`: backlog persistence
- `projects/<name>/project.json`: project control file, especially current status
- `projects/<name>/features.md`: project feature catalog
- `projects/<name>/timeline.md`: project timeline/history
- `projects/<name>/sprints.md`: generated aggregation derived from sprint files
- `tech/team/*.md`: team member notes
- team metrics markdown file under `tech/`: team metrics reference
- `tech/pjs.md`: PJ payment/control file

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

If `index.html` is opened directly, the app falls back to `localStorage`.

Use this only for UI exploration. It is not the main operating mode.

## Main User Views

### Sprint View

Primary weekly board for one sprint at a time.

Used to:

- create and edit project cards inside the sprint
- create and edit tasks
- assign responsibles
- mark tasks as blocked or high priority
- mark tasks as followed during the week
- move tasks between project cards and backlog

### Projects View

Cross-sprint view over all projects.

Used to:

- inspect projects in an aggregated way instead of listing every sprint occurrence
- filter by project
- inspect feature groups inside each project card
- open current tasks for one feature
- switch to taskboard mode
- switch to delivery mode

Current default behavior:

- one card per project
- feature list inside the project card
- area tags in the card are derived from the open tasks currently associated with that project
- tasks without feature are grouped under `Outros`
- clicking a feature opens the current task set for that feature
- repeated tasks across sprints are deduplicated and only the most recent occurrence is shown

### Taskboard

There are two taskboard variants:

- Sprint Taskboard: tasks grouped into `Blocked`, `Open`, `Doing`, `Testing`, `Done`
- Project Taskboard: projects grouped by current project status from `project.json`

Taskboard supports drag and drop.

### Delivery View

Delivery is the timeline-style view.

Current behavior:

- only available in `Projects View`
- hides backlog panel
- uses sprint columns horizontally
- in general mode, shows project continuity across sprints
- with a project filter selected, shows task continuity for that project
- cards are packed into the minimum number of shared rows without overlap
- cards are clickable and open details modals

### Workload View

Workload is the member/week allocation calendar.

Current behavior:

- only available in `Projects View`
- hides backlog panel
- uses week columns and maps projects into them from `startDate` to `deliveryDate`
- creates one row per active member from `tech/team/*.md`
- only includes projects that have both `Start Date` and `Delivery Date`
- shows active projects across the full date interval for each involved member
- only counts responsibles whose team file is marked `Ativo: Sim`
- shows member area when available in the team file
- workload cards show the project title only
- leaves empty ranges visible so free capacity is easy to spot

### Project Load View

Project Load is the project/week allocation calendar.

Current behavior:

- only available in `Projects View`
- hides backlog panel
- uses the same week columns and date range controls as `Workload View`
- creates one row per active project card that has both `Start Date` and `Delivery Date`
- project rows stay visible even when there is no responsible allocated yet
- open task `areas[]` are rendered as separate internal timeline rows for that project
- each internal row shows one area and the allocated members whose team file `Area` matches that task area
- if an open task requires an area and no allocated member matches that area, that area row is highlighted in yellow

## Main Data Model

### Sprint

- `name`
- `goal`
- `fileName`
- `topics[]`

Mapped from `tech/sprints/*.md`.

### Topic / Project Card

This is the main project-level unit inside a sprint.

- `title`
- `projectKey`
- `status`
- `description`
- `items[]`

`projectKey` links the sprint card to a real folder under `projects/`.

### Feature

A feature belongs to a project and lives in `projects/<project>/features.md`.

Each feature has:

- `name`
- `description`

Runtime behavior in the UI:

- features are managed through the Features modal
- each feature can be edited through its own pencil icon
- in `Projects View`, a derived feature status is shown:
  - `Closed`: all tasks in that feature are done
  - `Active`: at least one task in that feature is still open

### Item / Task

Tasks are intentionally compact and leadership-readable.

- `text`
- `done`
- `areas[]`
- `responsibles[]`
- `priority` (`normal` or `high`)
- `blocked`
- `blockedReason`
- `followed`
- `featureName`

Important distinction:

- `done` means completed
- `followed` means the item was worked on or accompanied during the week

Task modal behavior:

- task status is edited through a dropdown (`Open`, `Doing`, `Testing`, `Blocked`, `Done`)
- task areas are edited through a multi-select (`Back`, `Front`, `Mobile`, `Data`, `QA`, `UX/UI`, `Mkt`)
- blocked reason appears only when the task status is `Blocked`
- project linkage for sprint tasks is implicit from the project card and is not edited in the task modal

### Backlog Item

Stored in `tech/backlog.json`.

Backlog items can also carry:

- `projectKey`
- `projectTitle`
- `featureName`

Used as intake before the task enters a sprint.

### Project Control

Stored in `projects/<project>/project.json`.

Current use:

- canonical project name
- current project status for project taskboard and delivery coloring

### Timeline Event

Stored in `projects/<project>/timeline.md`.

- `date`
- `name`
- `description`

Use this for relevant project milestones, changes, or events worth revisiting.

## Frontend Architecture

All frontend logic lives in `app.js`.

### Key responsibilities

- DOM binding through `const el = { ... }`
- in-memory state
- markdown and JSON parsing/formatting
- API calls
- rendering all views and modals
- drag/drop behavior
- autosave orchestration
- `localStorage` fallback

### Important implication

Because there is no component architecture, changing markup IDs in `index.html` can easily break `app.js`.

Any UI edit should be checked against:

- `const el = { ... }`
- modal open/close functions
- event listeners near the bottom of `app.js`
- renderer functions that assume specific DOM structure

## Backend Architecture

`server.py` is intentionally minimal. It does three things:

1. serves static files from `sprint-hub/`
2. exposes JSON endpoints for the UI
3. reads/writes markdown and JSON files in the repo

### Notable backend behavior

- sprint files are loaded from `tech/sprints/*.md`
- backlog is returned together with sprint payloads
- `projects/<project>/sprints.md` is regenerated from sprint data
- `projects/<project>/timeline.md` is ensured automatically
- `projects/<project>/project.json` is ensured automatically
- `projects/<project>/features.md` is ensured automatically
- creating a new project folder also creates the support files above
- writes normalize line endings to `\n`

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

## Markdown And File Conventions

### Sprint files

Expected structure:

```md
# Sprint 26-19

Goal: Example goal

## Mobile App [project:mobile-app]
Status: Desenvolvimento

- [ ] Improve login feedback (Gui + Fel) [FEATURE: Authentication] [HIGH]
- [ ] Release blocker on API [BLOCKED: waiting backend change]
- [x] Close rollout checklist [FOLLOWED]
```

Relevant conventions:

- `## ... [project:folder-name]` links a sprint card to a project folder
- `[FEATURE: ...]` links a task to a project feature
- `[AREA: ...]` links a task to one or more delivery areas, comma-separated when needed
- `[HIGH]` marks high priority
- `[BLOCKED]` or `[BLOCKED: ...]` marks blocked state
- `[FOLLOWED]` marks weekly follow-up/work, not completion
- markdown checkbox `- [x]` still represents completion

### Features files

Expected structure:

```md
# Features - Mobile App

## Authentication
Login, token, session and access-related improvements.

## Push Notifications
Notification delivery and user preference handling.
```

### Timeline files

Expected structure:

```md
# Timeline - Mobile App

## 2026-05-11 - Production rollout
Short description
```

### Project control file

Expected structure:

```json
{
  "name": "mobile-app",
  "status": "Desenvolvimento"
}
```

### Team files

Current parsing depends on:

- first `# ` heading for member name
- `Nickname: ...`
- optional `Area: ...` using values such as `Back`, `Front`, `Mobile`, `Data`, `QA`, `UX/UI`, `Mkt`
- `Ativo: ...` to determine whether the member appears in assignment and workload flows

## Process Guidance

### How leaders should use it

- keep tasks concise and readable in seconds
- use project cards as weekly summary containers
- use features to group related task intent
- use `Projects View` to review features as the main cross-sprint summary unit
- use blocked reason for actionable context
- use timeline for notable events and milestones
- use backlog before bringing items into a sprint

### How not to use it

- do not mirror all Azure DevOps items
- do not model every squad workflow state here
- do not turn this into a detailed execution board
- do not overload tasks with implementation-only noise

The best mental model is:

> one project card should be understandable by another tech leader in seconds

## Current Strengths

- very low setup cost
- repo-native persistence
- easy to inspect and edit manually
- strong fit for leadership-oriented weekly review
- project files, feature catalog, backlog and timeline broaden the tool beyond sprint-only tracking
- delivery view gives a strong longitudinal picture across sprints

## Current Weaknesses

- `app.js` is still monolithic
- no automated tests
- no schema validation for markdown or JSON payloads
- UI and JS remain tightly coupled
- small parser changes can create regressions
- no audit/history of who changed what

## Technical Risks

- generated files like `projects/*/sprints.md` can create noisy git diffs
- manual edits to generated `sprints.md` can be overwritten
- parser drift in sprint markdown can silently lose metadata like feature links
- `localStorage` mode can diverge from file mode during debugging
- delivery/taskboard changes can easily break layout because the UI is state-heavy and view-heavy

## Recommended Developer Workflow

### Before editing

1. start the server
2. inspect `index.html`, `styles.css`, `app.js`, `server.py`
3. check whether the change affects parsing, rendering, persistence, or derived files
4. check git status because generated files may already be dirty

### When changing UI

Always verify:

- new IDs/classes are wired in `app.js`
- modal open/close flows still work
- Sprint View, Projects View, Taskboard, and Delivery still render
- feature cards in `Projects View` still open the correct latest tasks
- backlog visibility rules still hold
- mobile layout is still coherent

### When changing persistence

Always verify:

- markdown round-trip parsing
- `save-all` behavior
- derived project file generation
- project status compatibility
- feature compatibility
- backlog compatibility

## Suggested Refactors

### High value

- split `app.js` into modules:
  - API
  - parsing/formatting
  - rendering
  - modal handling
  - state/autosave
- centralize markdown serializers/parsers
- add smoke tests for sprint markdown round-trip
- add tests for feature parsing and task-feature binding

### Product-fit improvements

- keep tasks generic and leadership-readable
- preserve the `project -> feature -> task` model consistently
- keep strengthening delivery and summary views
- avoid drifting toward DevOps duplication

## Onboarding Checklist

For a new engineer or agent:

1. read this file
2. read `sprint-hub/README.md`
3. run the server locally
4. inspect one sprint markdown file in `tech/sprints/`
5. inspect one project folder in `projects/`
6. inspect `project.json`, `features.md`, and `timeline.md`
7. inspect `tech/backlog.json`
8. open the UI and exercise:
   - sprint selection
   - project editing
   - task create/edit
   - feature selection inside task editing
   - backlog add/edit
   - Projects View aggregated feature list
   - feature click to open current tasks
   - taskboard drag/drop
   - delivery view
   - features modal and per-feature edit icon
   - timeline modal
   - project files editor
   - team modal

## Practical Notes For Future Agents

- treat `tech/sprints/*.md` as the main business source of truth
- treat `projects/*/sprints.md` as generated artifacts
- treat `project.json`, `features.md`, and `timeline.md` as support files owned by the app
- avoid destructive git operations because the repo often contains local changes
- prefer minimal DOM ID changes because the frontend is ID-driven
- when changing task parsing, verify `FEATURE`, `HIGH`, `BLOCKED`, `FOLLOWED`, and checkbox semantics together
- when changing `Projects View`, distinguish between:
  - aggregated project/feature summary view
  - project taskboard grouped by status
  - delivery timeline view
