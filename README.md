# ColdNote

A personal/work notes repository with a Sprint Hub web app for managing sprint files directly.

## Sprint Hub
Sprint manager with direct file integration for `tech/sprints/*.md`.

### Features
- Create new sprints
- Create topics inside a sprint
- Add items to each topic
- Mark items complete
- Move topics between sprints
- Browse and edit `projects/` folder files (including subfolders)
- Create folders and new markdown files in `projects/`
- Delete markdown files in `projects/`
- Create templated meeting notes (`New Meeting`) in `projects/`
- Auto-load sprint markdown files on app open
- Auto-save sprint changes back to markdown files

### Run (file mode)
1. Start server:
   `python sprint-hub/server.py`
2. Open:
   `http://127.0.0.1:8765`

In this mode, the app reads and writes files in `tech/sprints`.

### Fallback mode
If you open `sprint-hub/index.html` directly (without server), it falls back to `localStorage`.
