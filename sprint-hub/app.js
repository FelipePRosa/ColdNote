const STORAGE_KEY = "sprint_hub_v1";
const TEAM_STORAGE_KEY = "sprint_hub_team_v1";

const el = {
  sprintsList: document.getElementById("sprintsList"),
  stats: document.getElementById("stats"),
  boardTitle: document.getElementById("boardTitle"),
  boardMeta: document.getElementById("boardMeta"),
  responsibleFilter: document.getElementById("responsibleFilter"),
  highOnlyFilter: document.getElementById("highOnlyFilter"),
  blockedOnlyFilter: document.getElementById("blockedOnlyFilter"),
  syncStatus: document.getElementById("syncStatus"),
  topicsGrid: document.getElementById("topicsGrid"),
  topicTemplate: document.getElementById("topicTemplate"),
  topicForm: document.getElementById("topicForm"),
  topicTitleInput: document.getElementById("topicTitleInput"),
  topicDescInput: document.getElementById("topicDescInput"),
  newTopicBtn: document.getElementById("newTopicBtn"),
  cancelTopicBtn: document.getElementById("cancelTopicBtn"),
  newSprintBtn: document.getElementById("newSprintBtn"),
  editSprintBtn: document.getElementById("editSprintBtn"),
  teamBtn: document.getElementById("teamBtn"),
  assigneeModal: document.getElementById("assigneeModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalItemText: document.getElementById("modalItemText"),
  modalHighPriorityCheck: document.getElementById("modalHighPriorityCheck"),
  modalBlockedCheck: document.getElementById("modalBlockedCheck"),
  modalAssigneeSelect: document.getElementById("modalAssigneeSelect"),
  modalClearBtn: document.getElementById("modalClearBtn"),
  modalCancelBtn: document.getElementById("modalCancelBtn"),
  modalSaveBtn: document.getElementById("modalSaveBtn"),
  projectModal: document.getElementById("projectModal"),
  projectTitleInput: document.getElementById("projectTitleInput"),
  projectDescInput: document.getElementById("projectDescInput"),
  projectCopyBtn: document.getElementById("projectCopyBtn"),
  projectDeleteBtn: document.getElementById("projectDeleteBtn"),
  projectCancelBtn: document.getElementById("projectCancelBtn"),
  projectSaveBtn: document.getElementById("projectSaveBtn"),
  copyTargetModal: document.getElementById("copyTargetModal"),
  copyOnlyOpenTasks: document.getElementById("copyOnlyOpenTasks"),
  copyTargetList: document.getElementById("copyTargetList"),
  copyTargetCancelBtn: document.getElementById("copyTargetCancelBtn"),
  sprintModal: document.getElementById("sprintModal"),
  sprintNameInput: document.getElementById("sprintNameInput"),
  sprintGoalInput: document.getElementById("sprintGoalInput"),
  sprintCopyBtn: document.getElementById("sprintCopyBtn"),
  sprintCancelBtn: document.getElementById("sprintCancelBtn"),
  sprintSaveBtn: document.getElementById("sprintSaveBtn"),
  projectsBtn: document.getElementById("projectsBtn"),
  projectsModal: document.getElementById("projectsModal"),
  projectsCloseBtn: document.getElementById("projectsCloseBtn"),
  projectsTree: document.getElementById("projectsTree"),
  projectsCurrentFile: document.getElementById("projectsCurrentFile"),
  projectsEditor: document.getElementById("projectsEditor"),
  projectsDeleteBtn: document.getElementById("projectsDeleteBtn"),
  projectsSaveBtn: document.getElementById("projectsSaveBtn"),
  projectsNewBtn: document.getElementById("projectsNewBtn"),
  createTypeModal: document.getElementById("createTypeModal"),
  createFolderChoiceBtn: document.getElementById("createFolderChoiceBtn"),
  createFileChoiceBtn: document.getElementById("createFileChoiceBtn"),
  createMeetingChoiceBtn: document.getElementById("createMeetingChoiceBtn"),
  createTypeCancelBtn: document.getElementById("createTypeCancelBtn"),
};

const uid = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

let state = {
  activeSprintId: null,
  sprints: [],
};

let dataMode = "loading";
let teamMembers = loadTeamMembers();
let itemEditModalOnSave = null;
let projectModalOnSave = null;
let projectModalOnDelete = null;
let projectModalOnCopy = null;
let projectModalCopyOptions = [];
let copyTargetOnPick = null;
let autoSaveTimer = null;
let autoSaveInFlight = false;
let autoSavePending = false;
let selectedResponsible = "";
let filterHighOnly = false;
let filterBlockedOnly = false;
let projectsTreeDirs = [];
let projectsTreeFiles = [];
let currentProjectFile = "";
let currentProjectDir = "";
let sprintModalOnSave = null;
let sprintModalOnCopy = null;
let dragTaskState = null;

function setStatus(text) {
  el.syncStatus.textContent = `Mode: ${text}`;
}

function seedState() {
  return {
    activeSprintId: "spr_1",
    sprints: [
      {
        id: "spr_1",
        name: "26-06",
        goal: "Stabilize Web + App deliveries",
        fileName: "26-06.md",
        topics: [
          {
            id: uid(),
            title: "Sales STG",
            description: "Delivery and quality improvements",
            items: [
              { id: uid(), text: "Finalize dashboard tasks", done: false, responsibles: [] },
              { id: uid(), text: "Close cache optimization", done: true, responsibles: ["Gui"] },
            ],
          },
        ],
      },
    ],
  };
}

function loadStateLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedState();
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.sprints)) return seedState();
    if (!parsed.activeSprintId && parsed.sprints.length) {
      parsed.activeSprintId = parsed.sprints[parsed.sprints.length - 1].id;
    }
    return parsed;
  } catch {
    return seedState();
  }
}

function saveStateLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadTeamMembers() {
  const fallback = ["Brunin", "Gui", "Guto", "Nu", "Rich", "Fel", "Vicco", "Andy", "Mkt", "Dani", "Maxo"];
  const raw = localStorage.getItem(TEAM_STORAGE_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed.map((x) => String(x).trim()).filter(Boolean);
  } catch {
    return fallback;
  }
}

function saveTeamTeamMembers() {
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamMembers));
}

function normalizeItem(item) {
  if (!Array.isArray(item.responsibles)) item.responsibles = [];
  if (item.priority !== "high") item.priority = "normal";
  item.blocked = Boolean(item.blocked);
  return item;
}

function itemDisplayText(item) {
  const names = (item.responsibles || []).filter(Boolean);
  if (!names.length) return item.text;
  return `${item.text} (${names.join(" + ")})`;
}

function parseItemTextAndResponsibles(rawText) {
  let text = String(rawText || "").trim();
  let priority = "normal";
  let blocked = false;

  const metaMatches = text.match(/\[(HIGH|BLOCKED)\]/gi) || [];
  metaMatches.forEach((m) => {
    if (/HIGH/i.test(m)) priority = "high";
    if (/BLOCKED/i.test(m)) blocked = true;
  });
  text = text.replace(/\s*\[(HIGH|BLOCKED)\]/gi, "").trim();

  const m = text.match(/^(.*)\(([^()]*)\)\s*$/);
  if (!m) return { text, responsibles: [], priority, blocked };

  const body = m[1].trim();
  const namesRaw = m[2].trim();
  if (!/[A-Za-z]/.test(namesRaw)) return { text, responsibles: [], priority, blocked };

  const responsibles = namesRaw
    .split(/\s*\+\s*|\s*,\s*/)
    .map((x) => x.trim())
    .filter(Boolean);

  if (!responsibles.length) return { text, responsibles: [], priority, blocked };
  return { text: body || text, responsibles, priority, blocked };
}

function parseSprintMarkdown(fileName, markdown) {
  const rawLines = markdown.split(/\r?\n/).map((x) => x.trimEnd());
  let name = fileName.replace(/\.md$/i, "");
  let goal = "";
  const topics = [];
  let currentTopic = null;

  for (const lineRaw of rawLines) {
    const line = lineRaw.trim();
    if (!line) continue;

    if (line.startsWith("# ")) {
      const v = line.slice(2).trim();
      name = v.replace(/^Sprint\s+/i, "").trim() || name;
      continue;
    }

    if (/^Goal:\s*/i.test(line)) {
      goal = line.replace(/^Goal:\s*/i, "").trim();
      continue;
    }

    if (/^##\s+/.test(line)) {
      currentTopic = {
        id: uid(),
        title: line.replace(/^##\s+/, "").trim(),
        description: "",
        items: [],
      };
      topics.push(currentTopic);
      continue;
    }

    if (/^- \[[ xX]\]\s+/.test(line)) {
      if (!currentTopic) {
        currentTopic = { id: uid(), title: "Updates", description: "", items: [] };
        topics.push(currentTopic);
      }
      const done = /^- \[[xX]\]/.test(line);
      const parsed = parseItemTextAndResponsibles(line.replace(/^- \[[ xX]\]\s+/, "").trim());
      if (parsed.text) {
        currentTopic.items.push({
          id: uid(),
          text: parsed.text,
          done,
          responsibles: parsed.responsibles,
          priority: parsed.priority,
          blocked: parsed.blocked,
        });
      }
      continue;
    }

    if (/^- /.test(line)) {
      if (!currentTopic) {
        currentTopic = { id: uid(), title: "Updates", description: "", items: [] };
        topics.push(currentTopic);
      }
      const parsed = parseItemTextAndResponsibles(line.replace(/^- /, "").trim());
      if (parsed.text) {
        currentTopic.items.push({
          id: uid(),
          text: parsed.text,
          done: false,
          responsibles: parsed.responsibles,
          priority: parsed.priority,
          blocked: parsed.blocked,
        });
      }
      continue;
    }

    if (!currentTopic) {
      currentTopic = { id: uid(), title: "Updates", description: "", items: [] };
      topics.push(currentTopic);
    }

    currentTopic.description = currentTopic.description
      ? `${currentTopic.description} ${line}`.trim()
      : line;
  }

  return {
    id: uid(),
    name,
    goal,
    fileName,
    topics,
  };
}

function sprintToMarkdown(sprint) {
  const lines = [`# Sprint ${sprint.name}`, ""];
  if (sprint.goal) lines.push(`Goal: ${sprint.goal}`, "");

  sprint.topics.forEach((topic) => {
    lines.push(`## ${topic.title}`);
    if (topic.description) lines.push(topic.description, "");

    if (!topic.items.length) {
      lines.push("- [ ] (no items)", "");
      return;
    }

    topic.items.forEach((item) => {
      let lineText = itemDisplayText(item);
      if (item.priority === "high") lineText += " [HIGH]";
      if (item.blocked) lineText += " [BLOCKED]";
      lines.push(`- [${item.done ? "x" : " "}] ${lineText}`);
    });
    lines.push("");
  });

  return lines.join("\n").trim() + "\n";
}

async function fetchSprintFiles() {
  const res = await fetch("/api/sprint-files");
  if (!res.ok) throw new Error("Failed to load sprint files");
  return res.json();
}

async function fetchProjectsTree() {
  const res = await fetch("/api/projects/tree");
  if (!res.ok) throw new Error("Failed to load projects tree");
  return res.json();
}

async function fetchProjectFile(relPath) {
  const url = `/api/projects/file?path=${encodeURIComponent(relPath)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load project file");
  return res.json();
}

async function saveProjectFile(relPath, content) {
  const res = await fetch("/api/projects/file/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: relPath, content }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to save project file");
  }
}

async function createProjectFolder(relPath) {
  const res = await fetch("/api/projects/folder/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: relPath }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to create folder");
  }
}

async function createProjectFile(relPath) {
  const res = await fetch("/api/projects/file/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: relPath }),
  });
  if (res.ok) return;

  if (res.status === 404) {
    // Backward-compatible fallback for servers that do not expose /file/create.
    await saveProjectFile(relPath, "");
    return;
  }

  const txt = await res.text();
  throw new Error(txt || "Failed to create file");
}

async function deleteProjectFile(relPath) {
  const res = await fetch("/api/projects/file/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: relPath }),
  });
  if (res.ok) return;

  if (res.status === 404 || res.status === 501) {
    throw new Error("Delete endpoint not available. Restart `python sprint-hub/server.py` and refresh the page.");
  }

  const txt = await res.text();
  const clean = String(txt || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  throw new Error(clean || "Failed to delete file");
}

function nowIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function buildMeetingTemplate(title = "Weekly Sync") {
  const date = nowIsoDate();
  return [
    `# ${title}`,
    "",
    `Date: ${date}`,
    "Attendees: ",
    "Agenda: ",
    "",
    "## Decisions",
    "- ",
    "",
    "## Actions",
    "- [ ] ",
    "",
    "## Blockers",
    "- ",
    "",
    "## Notes",
    "- ",
    "",
  ].join("\n");
}

async function runCreateFolderFlow() {
  const baseDir = getCurrentProjectsDir();
  const suggestion = baseDir ? `${baseDir}/` : "";
  const raw = window.prompt("New folder path (relative to projects/)", suggestion);
  if (!raw) return;
  const rel = raw.trim().replace(/^\/+|\/+$/g, "");
  if (!rel) return;

  await createProjectFolder(rel);
  await refreshProjectsModalData();
  setStatus("file-based (`tech/sprints/*.md`) - folder created");
}

async function runCreateFileFlow() {
  const baseDir = getCurrentProjectsDir();
  const suggestion = baseDir ? `${baseDir}/new-file.md` : "new-file.md";
  const raw = window.prompt("New markdown file path (relative to projects/)", suggestion);
  if (!raw) return;
  let rel = raw.trim().replace(/^\/+|\/+$/g, "");
  if (!rel) return;
  if (!rel.toLowerCase().endsWith(".md")) rel += ".md";

  await createProjectFile(rel);
  currentProjectFile = rel;
  await refreshProjectsModalData();
  setStatus("file-based (`tech/sprints/*.md`) - file created");
}

async function runCreateMeetingFlow() {
  const baseDir = getCurrentProjectsDir();
  const suggestion = baseDir
    ? `${baseDir}/meeting-${nowIsoDate()}.md`
    : `meeting-${nowIsoDate()}.md`;
  const raw = window.prompt("New meeting markdown path (relative to projects/)", suggestion);
  if (!raw) return;
  let rel = raw.trim().replace(/^\/+|\/+$/g, "");
  if (!rel) return;
  if (!rel.toLowerCase().endsWith(".md")) rel += ".md";

  await createProjectFile(rel);
  const title = rel.split("/").pop().replace(/\.md$/i, "").replace(/[-_]+/g, " ").trim() || "Weekly Sync";
  await saveProjectFile(rel, buildMeetingTemplate(title));
  currentProjectFile = rel;
  await refreshProjectsModalData();
  setStatus("file-based (`tech/sprints/*.md`) - meeting file created");
}

async function saveAllToFiles() {
  if (dataMode !== "files") {
    window.alert("File mode is not active. Start with server.py.");
    return;
  }

  const payload = {
    files: state.sprints.map((sprint) => ({
      name: sprint.name,
      content: sprintToMarkdown(sprint),
    })),
  };

  const res = await fetch("/api/sprint-files/save-all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Save failed");
  }
}

function getActiveSprint() {
  const sprint = state.sprints.find((s) => s.id === state.activeSprintId);
  return sprint || state.sprints[0] || null;
}

function countStats() {
  const allTopics = state.sprints.flatMap((s) => s.topics);
  const allItems = allTopics.flatMap((t) => t.items);
  return {
    sprints: state.sprints.length,
    topics: allTopics.length,
    items: allItems.length,
    doneItems: allItems.filter((i) => i.done).length,
  };
}

function beginTaskDrag(topicId, itemId) {
  dragTaskState = { topicId, itemId };
}

function endTaskDrag() {
  dragTaskState = null;
}

function moveDraggedTask(targetTopicId, beforeItemId = null) {
  if (!dragTaskState) return false;
  const sprint = getActiveSprint();
  if (!sprint) return false;

  const sourceTopic = sprint.topics.find((t) => t.id === dragTaskState.topicId);
  const targetTopic = sprint.topics.find((t) => t.id === targetTopicId);
  if (!sourceTopic || !targetTopic) return false;

  const sourceIndex = sourceTopic.items.findIndex((i) => i.id === dragTaskState.itemId);
  if (sourceIndex < 0) return false;

  const [movedItem] = sourceTopic.items.splice(sourceIndex, 1);
  if (!movedItem) return false;

  let insertIndex = targetTopic.items.length;
  if (beforeItemId) {
    const idx = targetTopic.items.findIndex((i) => i.id === beforeItemId);
    if (idx >= 0) insertIndex = idx;
  }

  if (sourceTopic.id === targetTopic.id && insertIndex > sourceIndex) {
    insertIndex -= 1;
  }

  targetTopic.items.splice(Math.max(0, insertIndex), 0, movedItem);
  persistState();
  render();
  return true;
}

function persistState() {
  if (dataMode === "local") {
    saveStateLocal();
    return;
  }
  scheduleAutoSave();
}

function scheduleAutoSave(delayMs = 260) {
  if (dataMode !== "files") return;
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    autoSaveTimer = null;
    flushAutoSave();
  }, delayMs);
}

async function flushAutoSave() {
  if (dataMode !== "files") return;
  if (autoSaveInFlight) {
    autoSavePending = true;
    return;
  }
  autoSaveInFlight = true;
  try {
    await saveAllToFiles();
    setStatus("file-based (`tech/sprints/*.md`) - auto-saved");
  } catch (err) {
    console.error("Auto-save failed:", err);
    setStatus("file-based (`tech/sprints/*.md`) - auto-save failed");
  } finally {
    autoSaveInFlight = false;
    if (autoSavePending) {
      autoSavePending = false;
      scheduleAutoSave(120);
    }
  }
}

function openTaskModal({ title, saveLabel, currentText, currentNames, onSave }) {
  itemEditModalOnSave = onSave;
  el.modalTitle.textContent = title || "Edit Task";
  el.modalSaveBtn.textContent = saveLabel || "Apply";
  el.modalItemText.value = currentText?.text || "";
  el.modalHighPriorityCheck.checked = currentText?.priority === "high";
  el.modalBlockedCheck.checked = Boolean(currentText?.blocked);
  el.modalAssigneeSelect.innerHTML = "";

  teamMembers.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    option.selected = currentNames.includes(name);
    el.modalAssigneeSelect.appendChild(option);
  });

  el.assigneeModal.classList.remove("hidden");
}

function closeAssigneeModal() {
  el.assigneeModal.classList.add("hidden");
  itemEditModalOnSave = null;
}

function openProjectModal(topic, currentSprintId, onSave, onDelete, onCopy) {
  projectModalOnSave = onSave;
  projectModalOnDelete = onDelete || null;
  projectModalOnCopy = onCopy || null;
  el.projectTitleInput.value = topic.title || "";
  el.projectDescInput.value = topic.description || "";
  el.projectDeleteBtn.classList.toggle("hidden", !projectModalOnDelete);
  projectModalCopyOptions = state.sprints.filter((s) => s.id !== currentSprintId);
  const canCopy = Boolean(projectModalOnCopy) && projectModalCopyOptions.length > 0;
  el.projectCopyBtn.disabled = !canCopy;
  el.projectModal.classList.remove("hidden");
}

function closeProjectModal() {
  el.projectModal.classList.add("hidden");
  projectModalOnSave = null;
  projectModalOnDelete = null;
  projectModalOnCopy = null;
  projectModalCopyOptions = [];
}

function openCopyTargetModal(options, onPick) {
  copyTargetOnPick = onPick;
  el.copyTargetList.innerHTML = "";
  el.copyOnlyOpenTasks.checked = false;
  options.forEach((sprint) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost copy-target-btn";
    btn.textContent = sprint.name;
    btn.addEventListener("click", () => {
      if (copyTargetOnPick) {
        copyTargetOnPick(sprint.id, {
          onlyOpenTasks: el.copyOnlyOpenTasks.checked,
        });
      }
      closeCopyTargetModal();
    });
    el.copyTargetList.appendChild(btn);
  });
  el.copyTargetModal.classList.remove("hidden");
  requestAnimationFrame(() => {
    el.copyTargetList.scrollTop = el.copyTargetList.scrollHeight;
  });
}

function closeCopyTargetModal() {
  el.copyTargetModal.classList.add("hidden");
  el.copyTargetList.innerHTML = "";
  copyTargetOnPick = null;
}

function openSprintModal(sprint, onSave, onCopy) {
  sprintModalOnSave = onSave;
  sprintModalOnCopy = onCopy;
  el.sprintNameInput.value = sprint?.name || "";
  el.sprintGoalInput.value = sprint?.goal || "";
  el.sprintModal.classList.remove("hidden");
}

function closeSprintModal() {
  el.sprintModal.classList.add("hidden");
  sprintModalOnSave = null;
  sprintModalOnCopy = null;
}

function buildTreeFromPaths(dirPaths, filePaths) {
  const root = { type: "dir", name: "projects", children: {} };
  dirPaths.forEach((p) => {
    const parts = p.split("/").filter(Boolean);
    let node = root;
    let acc = "";
    parts.forEach((part) => {
      acc = acc ? `${acc}/${part}` : part;
      if (!node.children[part]) {
        node.children[part] = { type: "dir", name: part, path: acc, children: {} };
      }
      node = node.children[part];
    });
  });

  filePaths.forEach((p) => {
    const parts = p.split("/").filter(Boolean);
    let node = root;
    let acc = "";
    parts.forEach((part, idx) => {
      const isFile = idx === parts.length - 1;
      acc = acc ? `${acc}/${part}` : part;
      if (!node.children[part]) {
        node.children[part] = isFile
          ? { type: "file", name: part, path: parts.join("/") }
          : { type: "dir", name: part, path: acc, children: {} };
      }
      node = node.children[part];
    });
  });
  return root;
}

function renderProjectTreeNode(node) {
  const ul = document.createElement("ul");
  const keys = Object.keys(node.children || {}).sort((a, b) => a.localeCompare(b));

  keys.forEach((key) => {
    const child = node.children[key];
    const li = document.createElement("li");
    li.className = "projects-tree-node";

    if (child.type === "dir") {
      const dir = document.createElement("div");
      dir.className = `projects-tree-dir ${currentProjectDir === child.path ? "active" : ""}`;
      dir.textContent = child.name;
      dir.addEventListener("click", () => {
        currentProjectDir = child.path || "";
        renderProjectsTree();
      });
      li.appendChild(dir);
      li.appendChild(renderProjectTreeNode(child));
    } else {
      const file = document.createElement("div");
      file.className = `projects-tree-file ${currentProjectFile === child.path ? "active" : ""}`;
      file.textContent = child.name;
      file.addEventListener("click", () => openProjectFile(child.path));
      li.appendChild(file);
    }

    ul.appendChild(li);
  });

  return ul;
}

function renderProjectsTree() {
  el.projectsTree.innerHTML = "";
  const tree = buildTreeFromPaths(projectsTreeDirs, projectsTreeFiles);
  el.projectsTree.appendChild(renderProjectTreeNode(tree));
}

async function openProjectFile(relPath) {
  const payload = await fetchProjectFile(relPath);
  currentProjectFile = payload.path;
  const idx = currentProjectFile.lastIndexOf("/");
  currentProjectDir = idx >= 0 ? currentProjectFile.slice(0, idx) : "";
  el.projectsCurrentFile.textContent = `projects/${payload.path}`;
  el.projectsEditor.value = payload.content || "";
  renderProjectsTree();
}

function getCurrentProjectsDir() {
  if (currentProjectDir) return currentProjectDir;
  if (!currentProjectFile) return "";
  const idx = currentProjectFile.lastIndexOf("/");
  return idx >= 0 ? currentProjectFile.slice(0, idx) : "";
}

async function refreshProjectsModalData() {
  const payload = await fetchProjectsTree();
  projectsTreeDirs = payload.dirs || [];
  projectsTreeFiles = payload.files || [];
  if (currentProjectFile && !projectsTreeFiles.includes(currentProjectFile)) {
    currentProjectFile = "";
  }
  if (currentProjectDir && !projectsTreeDirs.includes(currentProjectDir)) {
    currentProjectDir = "";
  }
  if (!currentProjectFile && projectsTreeFiles.length) currentProjectFile = projectsTreeFiles[0];

  renderProjectsTree();
  if (currentProjectFile) await openProjectFile(currentProjectFile);
  else {
    el.projectsCurrentFile.textContent = "No files found";
    el.projectsEditor.value = "";
  }
}

async function openProjectsModal() {
  try {
    await refreshProjectsModalData();
    el.projectsModal.classList.remove("hidden");
  } catch (err) {
    window.alert(`Failed to load projects files: ${err.message}`);
  }
}

function closeProjectsModal() {
  el.projectsModal.classList.add("hidden");
}

function openCreateTypeModal() {
  el.createTypeModal.classList.remove("hidden");
}

function closeCreateTypeModal() {
  el.createTypeModal.classList.add("hidden");
}

function renderStats() {
  const stats = countStats();
  const cards = [
    [stats.sprints, "Sprints"],
    [stats.topics, "Topics"],
    [stats.items, "Items"],
    [stats.doneItems, "Done"],
  ];
  el.stats.innerHTML = cards
    .map(
      ([value, label]) =>
        `<article class="stat"><strong>${value}</strong><span>${label}</span></article>`
    )
    .join("");
}

function renderSprintsList() {
  el.sprintsList.innerHTML = "";
  [...state.sprints].reverse().forEach((sprint) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = sprint.id === state.activeSprintId ? "active" : "";
    const closed = sprint.topics.flatMap((t) => t.items).filter((i) => i.done).length;
    btn.innerHTML = `<strong>${sprint.name}</strong><br><small class="muted">${closed} closed items</small>`;
    btn.addEventListener("click", () => {
      state.activeSprintId = sprint.id;
      persistState();
      render();
    });
    el.sprintsList.appendChild(btn);
  });
}

function renderResponsibleFilter() {
  const select = el.responsibleFilter;
  if (!select) return;

  const current = selectedResponsible;
  select.innerHTML = "";

  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = "Select All";
  select.appendChild(allOpt);

  teamMembers.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  if (teamMembers.includes(current)) select.value = current;
  else select.value = "";
}

function renderTopics() {
  const sprint = getActiveSprint();
  if (!sprint) {
    el.boardTitle.textContent = "No sprints yet";
    el.boardMeta.textContent = "Create your first sprint.";
    el.topicsGrid.innerHTML = "";
    return;
  }

  el.boardTitle.textContent = `Sprint ${sprint.name}`;
  el.boardMeta.textContent = sprint.goal || "No sprint goal defined.";
  el.topicsGrid.innerHTML = "";
  let renderedTopicCount = 0;

  sprint.topics.forEach((topic) => {
    const visibleItems = topic.items.filter((item) => {
      normalizeItem(item);
      if (selectedResponsible && !(item.responsibles || []).includes(selectedResponsible)) return false;
      if (filterHighOnly && item.priority !== "high") return false;
      if (filterBlockedOnly && !item.blocked) return false;
      return true;
    });
    if (selectedResponsible && visibleItems.length === 0) return;

    const node = el.topicTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".topic-title").textContent = topic.title;
    node.querySelector(".topic-desc").textContent = topic.description || "No description";
    node.querySelector(".topic-edit-btn").addEventListener("click", () => {
      openProjectModal(
        topic,
        sprint.id,
        ({ title, description }) => {
          topic.title = title;
          topic.description = description;
          persistState();
          render();
        },
        () => {
          const idx = sprint.topics.findIndex((t) => t.id === topic.id);
          if (idx < 0) return;
          sprint.topics.splice(idx, 1);
          persistState();
          render();
        },
        (targetSprintId, options = {}) => {
          const targetSprint = state.sprints.find((s) => s.id === targetSprintId);
          if (!targetSprint) return;
          const onlyOpenTasks = Boolean(options.onlyOpenTasks);
          const itemsToCopy = onlyOpenTasks
            ? topic.items.filter((item) => !item.done)
            : topic.items;

          const cloned = {
            id: uid(),
            title: topic.title,
            description: topic.description,
            items: itemsToCopy.map((item) => ({
              id: uid(),
              text: item.text,
              done: item.done,
              responsibles: [...(item.responsibles || [])],
              priority: item.priority === "high" ? "high" : "normal",
              blocked: Boolean(item.blocked),
            })),
          };

          targetSprint.topics.push(cloned);
          persistState();
          render();
        }
      );
    });

    const itemsList = node.querySelector(".items-list");
    if (visibleItems.length === 0) {
      itemsList.classList.add("empty-drop-zone");
      const emptyHint = document.createElement("li");
      emptyHint.className = "item-empty-hint";
      emptyHint.textContent = "Drop task here";
      itemsList.appendChild(emptyHint);
    }
    itemsList.addEventListener("dragover", (e) => {
      if (!dragTaskState) return;
      e.preventDefault();
      itemsList.classList.add("drop-active");
    });
    itemsList.addEventListener("dragleave", (e) => {
      if (e.relatedTarget && itemsList.contains(e.relatedTarget)) return;
      itemsList.classList.remove("drop-active");
    });
    itemsList.addEventListener("drop", (e) => {
      e.preventDefault();
      itemsList.classList.remove("drop-active");
      moveDraggedTask(topic.id, null);
      endTaskDrag();
    });

    visibleItems.forEach((item) => {
      const li = document.createElement("li");
      li.className = `item ${item.done ? "done" : ""} ${item.priority === "high" ? "item-high" : ""} ${item.blocked ? "item-blocked" : ""}`;
      li.draggable = true;
      normalizeItem(item);
      li.innerHTML = `
        <input type="checkbox" ${item.done ? "checked" : ""} />
        <span class="item-line"><span class="item-text"></span></span>
        <div>
          <button type="button" class="btn-link btn-link-neutral item-edit">edit</button>
          <button type="button" class="btn-link item-remove">remove</button>
        </div>
      `;
      li.querySelector(".item-text").textContent = itemDisplayText(item);
      const itemLine = li.querySelector(".item-line");
      if (item.priority === "high") {
        const tag = document.createElement("span");
        tag.className = "tag tag-high";
        tag.textContent = "HIGH";
        itemLine.appendChild(tag);
      }
      if (item.blocked) {
        const tag = document.createElement("span");
        tag.className = "tag tag-blocked";
        tag.textContent = "BLOCKED";
        itemLine.appendChild(tag);
      }

      li.addEventListener("dragstart", (e) => {
        beginTaskDrag(topic.id, item.id);
        li.classList.add("dragging");
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", item.id);
        }
      });

      li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        document.querySelectorAll(".item.drop-before").forEach((x) => x.classList.remove("drop-before"));
        document.querySelectorAll(".items-list.drop-active").forEach((x) => x.classList.remove("drop-active"));
        endTaskDrag();
      });

      li.addEventListener("dragover", (e) => {
        if (!dragTaskState || dragTaskState.itemId === item.id) return;
        e.preventDefault();
        li.classList.add("drop-before");
      });

      li.addEventListener("dragleave", () => {
        li.classList.remove("drop-before");
      });

      li.addEventListener("drop", (e) => {
        e.preventDefault();
        li.classList.remove("drop-before");
        moveDraggedTask(topic.id, item.id);
        endTaskDrag();
      });

      li.querySelector("input").addEventListener("change", (e) => {
        item.done = e.target.checked;
        persistState();
        render();
      });

      li.querySelector(".item-text").addEventListener("click", () => {
        item.done = !item.done;
        persistState();
        render();
      });

      li.querySelector(".item-remove").addEventListener("click", () => {
        topic.items = topic.items.filter((x) => x.id !== item.id);
        persistState();
        render();
      });

      li.querySelector(".item-edit").addEventListener("click", () => {
        openTaskModal({
          title: "Edit Task",
          saveLabel: "Apply",
          currentText: { text: item.text, priority: item.priority, blocked: item.blocked },
          currentNames: item.responsibles || [],
          onSave: ({ text, responsibles, priority, blocked }) => {
            item.text = text;
            item.responsibles = responsibles;
            item.priority = priority;
            item.blocked = blocked;
            persistState();
            render();
          },
        });
      });

      itemsList.appendChild(li);
    });

    const addItemBtn = node.querySelector(".add-item-btn");
    addItemBtn.addEventListener("click", () => {
      openTaskModal({
        title: "New Task",
        saveLabel: "Create",
        currentText: { text: "", priority: "normal", blocked: false },
        currentNames: [],
        onSave: ({ text, responsibles, priority, blocked }) => {
          topic.items.push({
            id: uid(),
            text,
            done: false,
            responsibles,
            priority,
            blocked,
          });
          persistState();
          render();
        },
      });
    });

    el.topicsGrid.appendChild(node);
    renderedTopicCount += 1;
  });

  if (selectedResponsible && renderedTopicCount === 0) {
    const msg = document.createElement("p");
    msg.className = "muted";
    msg.textContent = `No tasks found for ${selectedResponsible} in this sprint.`;
    el.topicsGrid.appendChild(msg);
  }
}

function render() {
  renderStats();
  renderSprintsList();
  renderResponsibleFilter();
  renderTopics();
}

function createSprint() {
  const name = window.prompt("Sprint name (e.g., 26-07)");
  if (!name || !name.trim()) return;
  const goal = window.prompt("Sprint goal (optional)") || "";

  const sprintName = name.trim();
  const sprint = {
    id: uid(),
    name: sprintName,
    goal: goal.trim(),
    fileName: `${sprintName}.md`,
    topics: [],
  };

  state.sprints.push(sprint);
  state.activeSprintId = sprint.id;
  persistState();
  render();
}

function copySprintFromSource(source, sprintName, includeDone) {
  if (!source) return;
  if (!sprintName || !sprintName.trim()) return;
  const cleanName = sprintName.trim();

  if (state.sprints.some((s) => s.name.toLowerCase() === cleanName.toLowerCase())) {
    window.alert("A sprint with this name already exists.");
    return;
  }

  const copiedTopics = source.topics.map((topic) => ({
    id: uid(),
    title: topic.title,
    description: topic.description,
    items: topic.items.map((item) => ({
      id: uid(),
      text: item.text,
      done: includeDone ? item.done : false,
      responsibles: [...(item.responsibles || [])],
      priority: item.priority === "high" ? "high" : "normal",
      blocked: Boolean(item.blocked),
    })),
  }));

  const copiedSprint = {
    id: uid(),
    name: cleanName,
    goal: source.goal,
    fileName: `${cleanName}.md`,
    topics: copiedTopics,
  };

  state.sprints.push(copiedSprint);
  state.activeSprintId = copiedSprint.id;
  persistState();
  render();
}

function addTopic(e) {
  e.preventDefault();
  const sprint = getActiveSprint();
  if (!sprint) return;

  const title = el.topicTitleInput.value.trim();
  const description = el.topicDescInput.value.trim();
  if (!title) return;

  sprint.topics.push({ id: uid(), title, description, items: [] });
  el.topicTitleInput.value = "";
  el.topicDescInput.value = "";
  el.topicForm.classList.add("hidden");
  persistState();
  render();
}

function manageTeamMembers() {
  const current = teamMembers.join(", ");
  const input = window.prompt(
    "Team members (comma-separated). Example: Bruf, Gui, Guto",
    current
  );
  if (input === null) return;
  const parsed = input
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (!parsed.length) {
    window.alert("Team list cannot be empty.");
    return;
  }
  teamMembers = Array.from(new Set(parsed));
  saveTeamMembers();
  render();
}

async function loadFromFiles() {
  try {
    const payload = await fetchSprintFiles();
    const parsed = payload.files.map((f) => parseSprintMarkdown(f.name, f.content));
    state = {
      activeSprintId: parsed[parsed.length - 1]?.id || null,
      sprints: parsed,
    };
    dataMode = "files";
    setStatus("file-based (`tech/sprints/*.md`)");
  } catch (err) {
    state = loadStateLocal();
    dataMode = "local";
    setStatus("localStorage fallback (run `python sprint-hub/server.py` for file mode)");
  }
  render();
}

el.newSprintBtn.addEventListener("click", createSprint);
el.editSprintBtn.addEventListener("click", () => {
  const sprint = getActiveSprint();
  if (!sprint) return;
  openSprintModal(
    sprint,
    ({ name, goal }) => {
      const exists = state.sprints.some(
        (s) => s.id !== sprint.id && s.name.toLowerCase() === name.toLowerCase()
      );
      if (exists) {
        window.alert("A sprint with this name already exists.");
        return;
      }
      sprint.name = name;
      sprint.goal = goal;
      sprint.fileName = `${name}.md`;
      persistState();
      render();
    },
    () => {
      const defaultName = `${sprint.name}-copy`;
      const nameInput = window.prompt("New sprint name", defaultName);
      if (!nameInput || !nameInput.trim()) return;
      const includeDone = window.confirm("Keep completed item status in the copy?");
      copySprintFromSource(sprint, nameInput.trim(), includeDone);
    }
  );
});
el.projectsBtn.addEventListener("click", openProjectsModal);
el.responsibleFilter.addEventListener("change", () => {
  selectedResponsible = el.responsibleFilter.value || "";
  render();
});
el.highOnlyFilter.addEventListener("change", () => {
  filterHighOnly = el.highOnlyFilter.checked;
  render();
});
el.blockedOnlyFilter.addEventListener("change", () => {
  filterBlockedOnly = el.blockedOnlyFilter.checked;
  render();
});
el.teamBtn.addEventListener("click", manageTeamMembers);

el.newTopicBtn.addEventListener("click", () => {
  el.topicForm.classList.remove("hidden");
  el.topicTitleInput.focus();
});
el.modalCancelBtn.addEventListener("click", closeAssigneeModal);
el.modalClearBtn.addEventListener("click", () => {
  Array.from(el.modalAssigneeSelect.options).forEach((opt) => {
    opt.selected = false;
  });
});
el.modalSaveBtn.addEventListener("click", () => {
  if (!itemEditModalOnSave) {
    closeAssigneeModal();
    return;
  }
  const text = el.modalItemText.value.trim();
  if (!text) {
    window.alert("Task text cannot be empty.");
    return;
  }
  const selected = Array.from(el.modalAssigneeSelect.selectedOptions).map((o) => o.value);
  itemEditModalOnSave({
    text,
    responsibles: selected,
    priority: el.modalHighPriorityCheck.checked ? "high" : "normal",
    blocked: el.modalBlockedCheck.checked,
  });
  closeAssigneeModal();
});
el.assigneeModal.addEventListener("click", (e) => {
  if (e.target === el.assigneeModal) closeAssigneeModal();
});
el.projectCancelBtn.addEventListener("click", closeProjectModal);
el.projectSaveBtn.addEventListener("click", () => {
  if (!projectModalOnSave) {
    closeProjectModal();
    return;
  }
  const title = el.projectTitleInput.value.trim();
  const description = el.projectDescInput.value.trim();
  if (!title) {
    window.alert("Project title cannot be empty.");
    return;
  }
  projectModalOnSave({ title, description });
  closeProjectModal();
});
el.projectDeleteBtn.addEventListener("click", () => {
  if (!projectModalOnDelete) return;
  if (!window.confirm("Remove this project and all its tasks?")) return;
  projectModalOnDelete();
  closeProjectModal();
});
el.projectCopyBtn.addEventListener("click", () => {
  if (!projectModalOnCopy) return;
  if (!projectModalCopyOptions.length) return;
  const copyOptions = {
    onlyOpenTasks: el.copyOnlyOpenTasks.checked,
  };

  if (projectModalCopyOptions.length === 1) {
    projectModalOnCopy(projectModalCopyOptions[0].id, copyOptions);
    closeProjectModal();
    return;
  }

  openCopyTargetModal(projectModalCopyOptions, (targetSprintId, modalOptions) => {
    projectModalOnCopy(targetSprintId, modalOptions || copyOptions);
    closeProjectModal();
  });
});
el.projectModal.addEventListener("click", (e) => {
  if (e.target === el.projectModal) closeProjectModal();
});
el.copyTargetCancelBtn.addEventListener("click", closeCopyTargetModal);
el.copyTargetModal.addEventListener("click", (e) => {
  if (e.target === el.copyTargetModal) closeCopyTargetModal();
});
el.sprintCancelBtn.addEventListener("click", closeSprintModal);
el.sprintSaveBtn.addEventListener("click", () => {
  if (!sprintModalOnSave) {
    closeSprintModal();
    return;
  }
  const name = el.sprintNameInput.value.trim();
  const goal = el.sprintGoalInput.value.trim();
  if (!name) {
    window.alert("Sprint name cannot be empty.");
    return;
  }
  sprintModalOnSave({ name, goal });
  closeSprintModal();
});
el.sprintCopyBtn.addEventListener("click", () => {
  if (!sprintModalOnCopy) return;
  sprintModalOnCopy();
});
el.sprintModal.addEventListener("click", (e) => {
  if (e.target === el.sprintModal) closeSprintModal();
});
el.projectsCloseBtn.addEventListener("click", closeProjectsModal);
el.projectsSaveBtn.addEventListener("click", async () => {
  if (!currentProjectFile) return;
  try {
    await saveProjectFile(currentProjectFile, el.projectsEditor.value);
    setStatus("file-based (`tech/sprints/*.md`) - project file saved");
  } catch (err) {
    window.alert(`Failed to save file: ${err.message}`);
  }
});
el.projectsDeleteBtn.addEventListener("click", async () => {
  if (!currentProjectFile) return;
  const confirmed = window.confirm(`Delete file "projects/${currentProjectFile}"?`);
  if (!confirmed) return;
  try {
    await deleteProjectFile(currentProjectFile);
    currentProjectFile = "";
    await refreshProjectsModalData();
    setStatus("file-based (`tech/sprints/*.md`) - project file deleted");
  } catch (err) {
    window.alert(`Failed to delete file: ${err.message}`);
  }
});
el.projectsNewBtn.addEventListener("click", () => {
  openCreateTypeModal();
});
el.createFolderChoiceBtn.addEventListener("click", async () => {
  try {
    await runCreateFolderFlow();
    closeCreateTypeModal();
  } catch (err) {
    window.alert(`Failed to create folder: ${err.message}`);
  }
});
el.createFileChoiceBtn.addEventListener("click", async () => {
  try {
    await runCreateFileFlow();
    closeCreateTypeModal();
  } catch (err) {
    window.alert(`Failed to create file: ${err.message}`);
  }
});
el.createMeetingChoiceBtn.addEventListener("click", async () => {
  try {
    await runCreateMeetingFlow();
    closeCreateTypeModal();
  } catch (err) {
    window.alert(`Failed to create meeting: ${err.message}`);
  }
});
el.createTypeCancelBtn.addEventListener("click", closeCreateTypeModal);
el.createTypeModal.addEventListener("click", (e) => {
  if (e.target === el.createTypeModal) closeCreateTypeModal();
});
el.projectsModal.addEventListener("click", (e) => {
  if (e.target === el.projectsModal) closeProjectsModal();
});

el.cancelTopicBtn.addEventListener("click", () => {
  el.topicForm.classList.add("hidden");
});

el.topicForm.addEventListener("submit", addTopic);

loadFromFiles();


