import json
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
SPRINTS_DIR = ROOT_DIR / "tech" / "sprints"
PJS_FILE = ROOT_DIR / "tech" / "pjs.md"
PROJECTS_DIR = ROOT_DIR / "projects"
HOST = "127.0.0.1"
PORT = 8765
PROJECT_SPRINTS_FROM = "26-01"


def safe_name(name: str) -> str:
  if not re.match(r"^[A-Za-z0-9._ -]+$", name):
    raise ValueError(f"Invalid sprint name: {name}")
  return name.strip()


def safe_rel_projects_path(raw: str) -> str:
  rel = str(raw or "").replace("\\", "/").strip().lstrip("/")
  if not rel:
    raise ValueError("Path is required")
  if ".." in rel.split("/"):
    raise ValueError("Invalid path")
  if rel.startswith("."):
    raise ValueError("Invalid path")
  return rel


def resolve_projects_file(rel: str) -> Path:
  target = (PROJECTS_DIR / rel).resolve()
  projects_resolved = PROJECTS_DIR.resolve()
  if projects_resolved not in target.parents and target != projects_resolved:
    raise ValueError("Path escapes projects directory")
  return target


def parse_sprint_code(name: str):
  m = re.match(r"^(\d{2})-(\d{2})$", str(name or "").strip())
  if not m:
    return None
  return (int(m.group(1)), int(m.group(2)))


def is_sprint_after_threshold(name: str, threshold: str = PROJECT_SPRINTS_FROM) -> bool:
  left = parse_sprint_code(name)
  right = parse_sprint_code(threshold)
  if not left or not right:
    return False
  return left > right


def sprint_sort_key(name: str):
  code = parse_sprint_code(name)
  if not code:
    return (999, 999, str(name))
  return (code[0], code[1], str(name))


def parse_topic_heading(raw_heading: str):
  raw = str(raw_heading or "").strip()
  m = re.match(r"^(.*?)\s*\[project:([^\]]+)\]\s*$", raw, flags=re.IGNORECASE)
  if not m:
    return (raw, "")
  title = (m.group(1) or "").strip() or raw
  project_key = (m.group(2) or "").strip()
  return (title, project_key)


def parse_project_tasks_from_sprint_markdown(content: str):
  tasks = []
  current_topic = ""
  current_project = ""
  for raw_line in str(content or "").splitlines():
    line = raw_line.strip()
    if not line:
      continue

    topic_m = re.match(r"^##\s+(.+)$", line)
    if topic_m:
      current_topic, current_project = parse_topic_heading(topic_m.group(1))
      continue

    task_m = re.match(r"^- \[([ xX])\]\s+(.+)$", line)
    if task_m:
      if not current_project:
        continue
      done = str(task_m.group(1)).lower() == "x"
      body = str(task_m.group(2) or "").strip()
      if body:
        tasks.append((current_project, current_topic or "Updates", done, body))
      continue

    bullet_m = re.match(r"^- (.+)$", line)
    if bullet_m:
      if not current_project:
        continue
      body = str(bullet_m.group(1) or "").strip()
      if body:
        tasks.append((current_project, current_topic or "Updates", False, body))
  return tasks


def build_project_sprints_markdown(project_name: str, sprint_topics: dict):
  lines = [
    f"# Sprints - {project_name}",
    "",
    f"Regra: inclui apenas sprints depois de {PROJECT_SPRINTS_FROM}.",
    "",
  ]
  if not sprint_topics:
    lines.extend(["_Sem tasks vinculadas neste periodo._", ""])
    return "\n".join(lines)

  for sprint_name in sorted(sprint_topics.keys(), key=sprint_sort_key):
    lines.append(f"## Sprint {sprint_name}")
    lines.append("")
    topic_map = sprint_topics[sprint_name]
    for topic_name in sorted(topic_map.keys(), key=lambda x: str(x).lower()):
      lines.append(f"### {topic_name}")
      for task_line in topic_map[topic_name]:
        lines.append(task_line)
      lines.append("")
  return "\n".join(lines).rstrip() + "\n"


def sync_project_sprints_files(files: list):
  PROJECTS_DIR.mkdir(parents=True, exist_ok=True)
  sprint_topics_by_project = {}
  dedupe_by_project = {}

  for file_data in files:
    sprint_name = safe_name(str(file_data.get("name", "")).replace(".md", ""))
    if not is_sprint_after_threshold(sprint_name):
      continue

    content = str(file_data.get("content", ""))
    for project_key, topic_name, done, body in parse_project_tasks_from_sprint_markdown(content):
      project_name = str(project_key or "").strip()
      if not project_name:
        continue
      task_line = f"- [{'x' if done else ' '}] {body}"
      dedupe_key = (sprint_name, topic_name, task_line)
      seen = dedupe_by_project.setdefault(project_name, set())
      if dedupe_key in seen:
        continue
      seen.add(dedupe_key)
      project_map = sprint_topics_by_project.setdefault(project_name, {})
      sprint_map = project_map.setdefault(sprint_name, {})
      sprint_map.setdefault(topic_name, []).append(task_line)

  synced = 0
  for path in sorted(PROJECTS_DIR.iterdir()):
    if not path.is_dir():
      continue
    project_name = path.name
    content = build_project_sprints_markdown(project_name, sprint_topics_by_project.get(project_name, {}))
    out = path / "sprints.md"
    out.write_text(content, encoding="utf-8", newline="\n")
    synced += 1
  return synced


class Handler(SimpleHTTPRequestHandler):
  def translate_path(self, path):
    parsed = urlparse(path).path
    rel = parsed.lstrip("/") or "index.html"
    return str(BASE_DIR / rel)

  def _json(self, code: int, payload: dict):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    self.send_response(code)
    self.send_header("Content-Type", "application/json; charset=utf-8")
    self.send_header("Content-Length", str(len(body)))
    self.end_headers()
    self.wfile.write(body)

  def do_GET(self):
    parsed_url = urlparse(self.path)
    parsed = parsed_url.path
    if parsed == "/api/pjs":
      PJS_FILE.parent.mkdir(parents=True, exist_ok=True)
      if not PJS_FILE.exists():
        PJS_FILE.write_text("# PJs\n", encoding="utf-8", newline="\n")
      self._json(
        200,
        {
          "path": "tech/pjs.md",
          "content": PJS_FILE.read_text(encoding="utf-8", errors="ignore"),
        },
      )
      return
    if parsed == "/api/sprint-files":
      SPRINTS_DIR.mkdir(parents=True, exist_ok=True)
      files = []
      for path in sorted(SPRINTS_DIR.glob("*.md")):
        files.append(
          {
            "name": path.name,
            "content": path.read_text(encoding="utf-8", errors="ignore"),
          }
        )
      self._json(200, {"files": files})
      return
    if parsed == "/api/projects/tree":
      PROJECTS_DIR.mkdir(parents=True, exist_ok=True)
      dirs = []
      files = []
      for path in sorted(PROJECTS_DIR.rglob("*")):
        rel = path.relative_to(PROJECTS_DIR).as_posix()
        if path.is_dir():
          dirs.append(rel)
        elif path.is_file():
          files.append(rel)
      self._json(200, {"root": "projects", "dirs": dirs, "files": files})
      return
    if parsed == "/api/projects/file":
      try:
        query = parse_qs(parsed_url.query or "")
        rel = safe_rel_projects_path((query.get("path") or [""])[0])
        file_path = resolve_projects_file(rel)
        if not file_path.exists() or not file_path.is_file():
          self._json(404, {"error": "File not found"})
          return
        self._json(
          200,
          {
            "path": rel,
            "content": file_path.read_text(encoding="utf-8", errors="ignore"),
          },
        )
      except Exception as exc:
        self._json(400, {"error": str(exc)})
      return
    return super().do_GET()

  def do_POST(self):
    parsed = urlparse(self.path).path
    if parsed == "/api/pjs/save":
      try:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        payload = json.loads(raw.decode("utf-8"))
        content = str(payload.get("content", ""))
        PJS_FILE.parent.mkdir(parents=True, exist_ok=True)
        PJS_FILE.write_text(content, encoding="utf-8", newline="\n")
        self._json(200, {"ok": True, "path": "tech/pjs.md"})
      except Exception as exc:
        self._json(400, {"error": str(exc)})
      return
    if parsed == "/api/sprint-files/save-all":
      try:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        payload = json.loads(raw.decode("utf-8"))
        files = payload.get("files", [])
        if not isinstance(files, list):
          raise ValueError("Invalid files payload")

        SPRINTS_DIR.mkdir(parents=True, exist_ok=True)
        for file_data in files:
          name = safe_name(str(file_data.get("name", "")).replace(".md", ""))
          content = str(file_data.get("content", ""))
          out = SPRINTS_DIR / f"{name}.md"
          out.write_text(content, encoding="utf-8", newline="\n")

        synced_projects = sync_project_sprints_files(files)
        self._json(
          200,
          {
            "ok": True,
            "saved": len(files),
            "synced_project_sprints": synced_projects,
            "project_sprints_after": PROJECT_SPRINTS_FROM,
          },
        )
      except Exception as exc:
        self._json(400, {"error": str(exc)})
      return
    if parsed == "/api/projects/file/save":
      try:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        payload = json.loads(raw.decode("utf-8"))
        rel = safe_rel_projects_path(str(payload.get("path", "")))
        content = str(payload.get("content", ""))
        out = resolve_projects_file(rel)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(content, encoding="utf-8", newline="\n")
        self._json(200, {"ok": True, "path": rel})
      except Exception as exc:
        self._json(400, {"error": str(exc)})
      return
    if parsed == "/api/projects/folder/create":
      try:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        payload = json.loads(raw.decode("utf-8"))
        rel = safe_rel_projects_path(str(payload.get("path", "")))
        out = resolve_projects_file(rel)
        if out.exists() and not out.is_dir():
          raise ValueError("A file already exists with this name")
        out.mkdir(parents=True, exist_ok=True)
        self._json(200, {"ok": True, "path": rel})
      except Exception as exc:
        self._json(400, {"error": str(exc)})
      return
    if parsed == "/api/projects/file/create":
      try:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        payload = json.loads(raw.decode("utf-8"))
        rel = safe_rel_projects_path(str(payload.get("path", "")))
        if not rel.lower().endswith(".md"):
          raise ValueError("Only .md files are supported")
        out = resolve_projects_file(rel)
        if out.exists():
          raise ValueError("File already exists")
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text("", encoding="utf-8", newline="\n")
        self._json(200, {"ok": True, "path": rel})
      except Exception as exc:
        self._json(400, {"error": str(exc)})
      return
    if parsed == "/api/projects/file/delete":
      try:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        payload = json.loads(raw.decode("utf-8"))
        rel = safe_rel_projects_path(str(payload.get("path", "")))
        out = resolve_projects_file(rel)
        if not out.exists() or not out.is_file():
          raise ValueError("File not found")
        out.unlink()
        self._json(200, {"ok": True, "path": rel})
      except Exception as exc:
        self._json(400, {"error": str(exc)})
      return
    if parsed != "/api/sprint-files/save-all":
      self._json(404, {"error": "Not found"})
      return

  def do_DELETE(self):
    parsed_url = urlparse(self.path)
    parsed = parsed_url.path
    if parsed == "/api/projects/file":
      try:
        query = parse_qs(parsed_url.query or "")
        rel = safe_rel_projects_path((query.get("path") or [""])[0])
        out = resolve_projects_file(rel)
        if not out.exists() or not out.is_file():
          raise ValueError("File not found")
        out.unlink()
        self._json(200, {"ok": True, "path": rel})
      except Exception as exc:
        self._json(400, {"error": str(exc)})
      return
    self._json(404, {"error": "Not found"})


if __name__ == "__main__":
  server = ThreadingHTTPServer((HOST, PORT), Handler)
  print(f"Sprint Hub server running on http://{HOST}:{PORT}")
  print(f"Serving app from: {BASE_DIR}")
  print(f"Managing sprint files in: {SPRINTS_DIR}")
  server.serve_forever()
