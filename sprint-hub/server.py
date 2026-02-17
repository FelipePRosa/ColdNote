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

        self._json(200, {"ok": True, "saved": len(files)})
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
