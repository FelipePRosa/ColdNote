const STORAGE_KEY = "sprint_hub_v1";

const el = {
  sprintsList: document.getElementById("sprintsList"),
  leftPanelTitle: document.getElementById("leftPanelTitle"),
  leftPanelSearch: document.getElementById("leftPanelSearch"),
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
  topicProjectSelect: document.getElementById("topicProjectSelect"),
  topicDescInput: document.getElementById("topicDescInput"),
  newTopicBtn: document.getElementById("newTopicBtn"),
  cancelTopicBtn: document.getElementById("cancelTopicBtn"),
  newSprintBtn: document.getElementById("newSprintBtn"),
  editSprintBtn: document.getElementById("editSprintBtn"),
  viewModeBtn: document.getElementById("viewModeBtn"),
  pjsBtn: document.getElementById("pjsBtn"),
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
  projectKeySelect: document.getElementById("projectKeySelect"),
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
  pjsModal: document.getElementById("pjsModal"),
  pjsRows: document.getElementById("pjsRows"),
  pjsAddRowBtn: document.getElementById("pjsAddRowBtn"),
  pjsSaveBtn: document.getElementById("pjsSaveBtn"),
  pjsCloseBtn: document.getElementById("pjsCloseBtn"),
  teamModal: document.getElementById("teamModal"),
  teamRows: document.getElementById("teamRows"),
  teamCurrentFile: document.getElementById("teamCurrentFile"),
  teamEditor: document.getElementById("teamEditor"),
  teamNewBtn: document.getElementById("teamNewBtn"),
  teamToggleInactiveBtn: document.getElementById("teamToggleInactiveBtn"),
  teamMetricsBtn: document.getElementById("teamMetricsBtn"),
  teamDeleteBtn: document.getElementById("teamDeleteBtn"),
  teamSaveBtn: document.getElementById("teamSaveBtn"),
  teamCloseBtn: document.getElementById("teamCloseBtn"),
};

const uid = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const TEAM_METRICS_VIRTUAL_PATH = "__team_metrics__";

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
let boardView = "sprints";
let selectedProjectKey = "";
let projectSearchText = "";
let selectedResponsible = "";
let filterHighOnly = false;
let filterBlockedOnly = false;
let projectCatalog = [];
let projectsTreeDirs = [];
let projectsTreeFiles = [];
let currentProjectFile = "";
let currentProjectDir = "";
let sprintModalOnSave = null;
let sprintModalOnCopy = null;
let dragTaskState = null;
let pjsEntries = [];
let teamEntries = [];
let currentTeamFile = "";
let showInactiveTeamMembers = false;

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
            projectKey: "",
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
    parsed.sprints = (parsed.sprints || []).map((sprint) => ({
      ...sprint,
      topics: (sprint.topics || []).map((topic) =>
        normalizeTopic({
          ...topic,
        })
      ),
    }));
    return parsed;
  } catch {
    return seedState();
  }
}

function saveStateLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadTeamMembers() {
  return ["Brunin", "Gui", "Guto", "Nu", "Rich", "Fel", "Vicco", "Andy", "Mkt", "Dani", "Maxo", "Berg"];
}

function getAssignableMembers() {
  return Array.from(new Set(teamMembers.map((x) => String(x || "").trim()).filter(Boolean)));
}

function parseTeamActiveFromContent(content) {
  const lines = String(content || "").split(/\r?\n/);
  for (const raw of lines) {
    const m = raw.match(/^\s*Ativo\s*:\s*(.*)\s*$/i);
    if (!m) continue;
    const value = String(m[1] || "").trim().toLowerCase();
    return value === "sim" || value === "yes" || value === "true" || value === "1";
  }
  return false;
}

function parseTeamAverageScore(content) {
  const lines = String(content || "").split(/\r?\n/);
  let inScoreBlock = false;
  const scores = [];
  for (const raw of lines) {
    const line = String(raw || "").trim();
    if (!line) continue;
    if (/^placar tech innovation$/i.test(line)) {
      inScoreBlock = true;
      continue;
    }
    if (!inScoreBlock) continue;
    if (/^#{1,6}\s+/.test(line)) break;
    const m = line.match(/^[^:]+:\s*(-?\d+(?:[.,]\d+)?)\s*$/);
    if (!m) continue;
    const value = Number(String(m[1]).replace(",", "."));
    if (!Number.isFinite(value)) continue;
    scores.push(value);
  }
  if (!scores.length) return null;
  return scores.reduce((sum, n) => sum + n, 0) / scores.length;
}

function isTeamMetricsFile(path) {
  return String(path || "") === TEAM_METRICS_VIRTUAL_PATH;
}

function normalizeItem(item) {
  if (!Array.isArray(item.responsibles)) item.responsibles = [];
  if (item.priority !== "high") item.priority = "normal";
  item.blocked = Boolean(item.blocked);
  return item;
}

function normalizeProjectKey(raw) {
  return String(raw || "").trim().replace(/\s+/g, " ");
}

function parseTopicHeading(rawHeading) {
  const raw = String(rawHeading || "").trim();
  const m = raw.match(/^(.*?)\s*\[project:([^\]]+)\]\s*$/i);
  if (!m) return { title: raw, projectKey: "" };
  return {
    title: (m[1] || "").trim() || raw,
    projectKey: normalizeProjectKey(m[2]),
  };
}

function formatTopicHeading(topic) {
  const title = String(topic.title || "").trim();
  const projectKey = normalizeProjectKey(topic.projectKey);
  if (!projectKey) return title;
  return `${title} [project:${projectKey.replace(/\]/g, "")}]`;
}

function extractRootProjectKeys(dirs, files) {
  const roots = new Set();
  (dirs || []).forEach((p) => {
    const first = String(p || "").split("/").filter(Boolean)[0];
    if (first) roots.add(first);
  });
  (files || []).forEach((p) => {
    const parts = String(p || "").split("/").filter(Boolean);
    if (parts.length < 2) return;
    const first = parts[0];
    if (first) roots.add(first);
  });
  return Array.from(roots).sort((a, b) => a.localeCompare(b));
}

function projectLabel(projectKey) {
  const key = normalizeProjectKey(projectKey);
  return key || "No project";
}

function inferProjectKeyFromTitle(title) {
  const cleanTitle = String(title || "").trim().toLowerCase();
  if (!cleanTitle) return "";
  const match = projectCatalog.find((name) => name.toLowerCase() === cleanTitle);
  return match || "";
}

function normalizeTopic(topic) {
  topic.projectKey = normalizeProjectKey(topic.projectKey) || inferProjectKeyFromTitle(topic.title);
  if (!Array.isArray(topic.items)) topic.items = [];
  topic.items = topic.items.map((item) => normalizeItem(item));
  return topic;
}

function normalizeAllTopics() {
  state.sprints.forEach((sprint) => {
    sprint.topics = (sprint.topics || []).map((topic) => normalizeTopic(topic));
  });
}

function updateProjectCatalogFromTree(dirs, files) {
  projectCatalog = extractRootProjectKeys(dirs, files);
  normalizeAllTopics();
}

async function refreshProjectCatalog() {
  try {
    const payload = await fetchProjectsTree();
    updateProjectCatalogFromTree(payload.dirs || [], payload.files || []);
  } catch {
    projectCatalog = [];
  }
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
      const heading = parseTopicHeading(line.replace(/^##\s+/, "").trim());
      currentTopic = {
        id: uid(),
        title: heading.title,
        projectKey: heading.projectKey,
        description: "",
        items: [],
      };
      topics.push(currentTopic);
      continue;
    }

    if (/^- \[[ xX]\]\s+/.test(line)) {
      if (!currentTopic) {
        currentTopic = { id: uid(), title: "Updates", projectKey: "", description: "", items: [] };
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
        currentTopic = { id: uid(), title: "Updates", projectKey: "", description: "", items: [] };
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
      currentTopic = { id: uid(), title: "Updates", projectKey: "", description: "", items: [] };
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
    lines.push(`## ${formatTopicHeading(topic)}`);
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

async function fetchPjsFile() {
  const res = await fetch("/api/pjs");
  if (!res.ok) throw new Error("Failed to load PJs file");
  return res.json();
}

async function savePjsFile(content) {
  const res = await fetch("/api/pjs/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to save PJs file");
  }
}

async function fetchTeamMembersFile() {
  const res = await fetch("/api/team-members");
  if (!res.ok) throw new Error("Failed to load Team files");
  return res.json();
}

async function fetchTeamMetricsFile() {
  const res = await fetch("/api/team-metrics");
  if (!res.ok) throw new Error("Failed to load Team metrics file");
  return res.json();
}

async function fetchTeamMemberFile(path) {
  const url = `/api/team-member/file?path=${encodeURIComponent(path)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load Team member file");
  return res.json();
}

async function saveTeamMemberFile(path, content) {
  const res = await fetch("/api/team-member/file/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, content }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to save Team member file");
  }
}

async function createTeamMemberFile(path, content) {
  const res = await fetch("/api/team-member/file/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, content }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to create Team member file");
  }
}

async function deleteTeamMemberFile(path) {
  const res = await fetch("/api/team-member/file/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to delete Team member file");
  }
}

function currentPaymentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function createEmptyPjEntry() {
  return {
    supplierNumber: "",
    orderNumber: "",
    supplierName: "",
    monthlyValue: "",
    notes: "",
    paidMonth: "",
  };
}

function parseLegacyPjLine(line) {
  const m = line.match(
    /^(ok|x)\s*-\s*([0-9]+)\s*(?:-\s*([0-9]+)\s*)?:\s*([^=]+?)\s*=\s*([^(]+?)\s*(?:\((.*)\))?$/i
  );
  if (!m) return null;
  const status = String(m[1] || "").trim().toLowerCase();
  if (status === "x") return null;
  return {
    supplierNumber: (m[2] || "").trim(),
    orderNumber: (m[3] || "").trim(),
    supplierName: (m[4] || "").trim(),
    monthlyValue: (m[5] || "").trim(),
    notes: (m[6] || "").trim(),
    paidMonth: "",
  };
}

function parsePjsMarkdown(content) {
  const lines = String(content || "").split(/\r?\n/);
  const entries = [];
  const monthKey = currentPaymentMonth();

  lines.forEach((lineRaw) => {
    const line = lineRaw.trim();
    if (!line) return;

    if (/^##\s+/i.test(line)) return;

    if (line.startsWith("|")) {
      if (/^\|\s*-/.test(line)) return;
      const cells = line.split("|").slice(1, -1).map((x) => x.trim());
      if (!cells.length) return;
      if (/^status$/i.test(cells[0]) || /^n\./i.test(cells[0])) return;

      // Old table format: Status | Fornecedor | Pedido | Nome | Valor | Observacoes
      if (/^(ok|x)$/i.test(cells[0])) {
        if (/^x$/i.test(cells[0])) return;
        if (cells.length < 6) return;
        entries.push({
          supplierNumber: cells[1] || "",
          orderNumber: cells[2] || "",
          supplierName: cells[3] || "",
          monthlyValue: cells[4] || "",
          notes: cells[5] || "",
          paidMonth: "",
        });
        return;
      }

      // New table format: Fornecedor | Pedido | Nome | Valor | Pago no mes | Observacoes
      if (cells.length < 6) return;
      const paidCell = String(cells[4] || "").trim().toLowerCase();
      const isPaid =
        paidCell === "sim" ||
        paidCell === "yes" ||
        paidCell === "true" ||
        paidCell === "1" ||
        paidCell === monthKey;
      entries.push({
        supplierNumber: cells[0] || "",
        orderNumber: cells[1] || "",
        supplierName: cells[2] || "",
        monthlyValue: cells[3] || "",
        paidMonth: isPaid ? monthKey : "",
        notes: cells[5] || "",
      });
      return;
    }

    const legacy = parseLegacyPjLine(line);
    if (legacy) entries.push(legacy);
  });

  return entries;
}

function pjsToMarkdown(entries) {
  const monthKey = currentPaymentMonth();
  const clean = entries
    .map((entry) => ({
      supplierNumber: String(entry.supplierNumber || "").trim(),
      orderNumber: String(entry.orderNumber || "").trim(),
      supplierName: String(entry.supplierName || "").trim(),
      monthlyValue: String(entry.monthlyValue || "").trim(),
      notes: String(entry.notes || "").trim(),
      paidMonth: String(entry.paidMonth || "").trim(),
    }))
    .filter(
      (entry) =>
        entry.supplierNumber || entry.orderNumber || entry.supplierName || entry.monthlyValue || entry.notes
    );

  const tableHeader = [
    `| N. Fornecedor | N. Pedido aberto | Nome Fornecedor | Valor Mensal | Pago (${monthKey}) | Observacoes |`,
    "| --- | --- | --- | --- | --- | --- |",
  ];
  const toRow = (entry) =>
    `| ${entry.supplierNumber} | ${entry.orderNumber} | ${entry.supplierName} | ${entry.monthlyValue} | ${entry.paidMonth === monthKey ? "SIM" : ""} | ${entry.notes} |`;
  const lines = [
    "# PJs",
    "",
    `Referencia de pagamento: ${monthKey}`,
    "",
    "## Ativos",
    ...tableHeader,
    ...clean.map(toRow),
    "",
  ];
  return lines.join("\n");
}

function renderPjsRows() {
  el.pjsRows.innerHTML = "";

  pjsEntries.forEach((entry, idx) => {
    const tr = document.createElement("tr");
    const monthKey = currentPaymentMonth();

    const fields = [
      ["supplierNumber", "Fornecedor"],
      ["orderNumber", "Pedido"],
      ["supplierName", "Nome"],
      ["monthlyValue", "R$ 0,00"],
    ];

    fields.forEach(([key, placeholder]) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.className = "pjs-input";
      input.placeholder = placeholder;
      input.value = entry[key] || "";
      input.addEventListener("input", () => {
        pjsEntries[idx][key] = input.value;
      });
      td.appendChild(input);
      tr.appendChild(td);
    });

    const paidTd = document.createElement("td");
    const paidInput = document.createElement("input");
    paidInput.type = "checkbox";
    paidInput.checked = entry.paidMonth === monthKey;
    paidInput.addEventListener("change", () => {
      pjsEntries[idx].paidMonth = paidInput.checked ? monthKey : "";
    });
    paidTd.appendChild(paidInput);
    tr.appendChild(paidTd);

    const notesTd = document.createElement("td");
    const notesInput = document.createElement("input");
    notesInput.type = "text";
    notesInput.className = "pjs-input";
    notesInput.placeholder = "Obs";
    notesInput.value = entry.notes || "";
    notesInput.addEventListener("input", () => {
      pjsEntries[idx].notes = notesInput.value;
    });
    notesTd.appendChild(notesInput);
    tr.appendChild(notesTd);

    const actions = document.createElement("td");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn btn-link";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      pjsEntries.splice(idx, 1);
      renderPjsRows();
    });
    actions.appendChild(remove);
    tr.appendChild(actions);

    el.pjsRows.appendChild(tr);
  });
}

async function openPjsModal() {
  try {
    const payload = await fetchPjsFile();
    pjsEntries = parsePjsMarkdown(payload.content || "");
    if (!pjsEntries.length) pjsEntries = [createEmptyPjEntry()];
    renderPjsRows();
    el.pjsModal.classList.remove("hidden");
  } catch (err) {
    window.alert(`Failed to load PJs: ${err.message}`);
  }
}

function closePjsModal() {
  el.pjsModal.classList.add("hidden");
}

function renderTeamRows() {
  el.teamRows.innerHTML = "";
  const sorted = [...teamEntries].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  const visible = showInactiveTeamMembers ? sorted : sorted.filter((entry) => entry.active);
  visible.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.className = `team-row ${entry.path === currentTeamFile ? "active" : ""} ${entry.active ? "" : "team-row-inactive"}`;
    tr.addEventListener("click", async () => {
      try {
        await openTeamMember(entry.path);
      } catch (err) {
        window.alert(`Failed to open Team member: ${err.message}`);
      }
    });

    const nameTd = document.createElement("td");
    nameTd.textContent = entry.name || "";
    tr.appendChild(nameTd);

    const nickTd = document.createElement("td");
    nickTd.textContent = entry.nickname || "";
    tr.appendChild(nickTd);

    const avgTd = document.createElement("td");
    avgTd.textContent = Number.isFinite(entry.average) ? entry.average.toFixed(1) : "-";
    tr.appendChild(avgTd);

    el.teamRows.appendChild(tr);
  });
}

async function loadTeamMembersFromFiles() {
  const payload = await fetchTeamMembersFile();
  const members = Array.isArray(payload.members) ? payload.members : [];
  teamEntries = members.map((m) => ({
    path: String(m.path || "").trim(),
    name: String(m.name || "").trim(),
    nickname: String(m.nickname || "").trim(),
    content: String(m.content || ""),
    active: parseTeamActiveFromContent(m.content || ""),
    average: parseTeamAverageScore(m.content || ""),
  }));
  const fromFiles = Array.from(
    new Set(teamEntries.filter((x) => x.active).map((x) => x.nickname).filter(Boolean))
  );
  if (fromFiles.length) teamMembers = fromFiles;
}

function teamTemplate(name, nickname) {
  return [`# ${name}`, "", `Nickname: ${nickname}`, "Ativo: Sim", "", "Notes:", "- "].join("\n") + "\n";
}

function setTeamActiveLine(content, activeValue) {
  const lines = String(content || "").split(/\r?\n/);
  const activeLine = `Ativo: ${activeValue}`;
  let replaced = false;
  const out = lines.map((raw) => {
    if (/^\s*Ativo\s*:\s*.*$/i.test(raw)) {
      replaced = true;
      return activeLine;
    }
    return raw;
  });
  if (!replaced) {
    let insertAt = out.findIndex((line) => /^\s*Nickname\s*:/i.test(line));
    if (insertAt >= 0) insertAt += 1;
    else {
      insertAt = out.findIndex((line) => /^\s*#\s+/.test(line));
      insertAt = insertAt >= 0 ? insertAt + 1 : 0;
    }
    out.splice(insertAt, 0, activeLine);
  }
  return out.join("\n").replace(/\s+$/, "") + "\n";
}

async function refreshTeamModalData(preferredPath = "") {
  await loadTeamMembersFromFiles();
  const sorted = [...teamEntries].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  const visible = showInactiveTeamMembers ? sorted : sorted.filter((entry) => entry.active);
  if (preferredPath && visible.some((x) => x.path === preferredPath)) {
    currentTeamFile = preferredPath;
  } else if (currentTeamFile && visible.some((x) => x.path === currentTeamFile)) {
    // Keep current selection.
  } else {
    currentTeamFile = visible[0]?.path || "";
  }
  el.teamToggleInactiveBtn.textContent = showInactiveTeamMembers ? "Hide Inactive" : "Show Inactive";
  renderTeamRows();
  if (currentTeamFile) await openTeamMember(currentTeamFile);
  else {
    el.teamCurrentFile.textContent = "No team members found";
    el.teamEditor.value = "";
  }
  renderResponsibleFilter();
}

async function openTeamMember(path) {
  const payload = await fetchTeamMemberFile(path);
  currentTeamFile = payload.path;
  el.teamCurrentFile.textContent = `tech/team/${payload.path}`;
  el.teamEditor.value = payload.content || "";
  const metricsMode = isTeamMetricsFile(currentTeamFile);
  el.teamEditor.readOnly = metricsMode;
  el.teamSaveBtn.disabled = metricsMode;
  el.teamDeleteBtn.disabled = metricsMode;
  renderTeamRows();
}

async function openTeamMetrics() {
  const payload = await fetchTeamMetricsFile();
  currentTeamFile = TEAM_METRICS_VIRTUAL_PATH;
  el.teamCurrentFile.textContent = payload.path || "tech/métricas.md";
  el.teamEditor.value = payload.content || "";
  el.teamEditor.readOnly = true;
  el.teamSaveBtn.disabled = true;
  el.teamDeleteBtn.disabled = true;
  renderTeamRows();
}

async function createTeamMemberFlow() {
  const rawName = window.prompt("Member full name", "");
  if (!rawName || !rawName.trim()) return;
  const name = rawName.trim();
  const rawNickname = window.prompt("Nickname", "");
  if (rawNickname === null) return;
  const nickname = rawNickname.trim();
  const suggestedFile = `${name.toLowerCase().replace(/[^a-z0-9 -]/gi, "").replace(/\s+/g, " ").trim()}.md`;
  const rawPath = window.prompt("Member file name (.md)", suggestedFile);
  if (!rawPath || !rawPath.trim()) return;
  let fileName = rawPath.trim();
  if (!fileName.toLowerCase().endsWith(".md")) fileName += ".md";
  await createTeamMemberFile(fileName, teamTemplate(name, nickname));
  await refreshTeamModalData(fileName);
  setStatus("file-based (`tech/team/*.md`) - member created");
}

async function inactivateCurrentTeamMember() {
  if (!currentTeamFile) return;
  if (isTeamMetricsFile(currentTeamFile)) return;
  const confirmed = window.confirm(`Inativar membro "tech/team/${currentTeamFile}" (Ativo: Não)?`);
  if (!confirmed) return;
  const updatedContent = setTeamActiveLine(el.teamEditor.value, "Não");
  await saveTeamMemberFile(currentTeamFile, updatedContent);
  await refreshTeamModalData(currentTeamFile);
  setStatus(`file-based (\`tech/team/*.md\`) - member inactivated`);
}

async function saveCurrentTeamMember() {
  if (!currentTeamFile) return;
  if (isTeamMetricsFile(currentTeamFile)) return;
  await saveTeamMemberFile(currentTeamFile, el.teamEditor.value);
  await refreshTeamModalData(currentTeamFile);
  setStatus("file-based (`tech/team/*.md`) - member saved");
}

async function openTeamModal() {
  try {
    await refreshTeamModalData();
    el.teamModal.classList.remove("hidden");
  } catch (err) {
    window.alert(`Failed to load Team: ${err.message}`);
  }
}

function closeTeamModal() {
  el.teamModal.classList.add("hidden");
  el.teamEditor.readOnly = false;
  el.teamSaveBtn.disabled = false;
  el.teamDeleteBtn.disabled = false;
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

  getAssignableMembers().forEach((name) => {
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
  renderProjectModalSelect(topic.projectKey || "");
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
  updateProjectCatalogFromTree(projectsTreeDirs, projectsTreeFiles);
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

function renderProjectsList() {
  el.sprintsList.innerHTML = "";
  const search = projectSearchText.trim().toLowerCase();
  const items = projectCatalog.filter((name) => !search || name.toLowerCase().includes(search));

  if (!items.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No projects found.";
    el.sprintsList.appendChild(li);
    return;
  }

  items.forEach((name) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = name === selectedProjectKey ? "active" : "";
    const count = state.sprints.reduce(
      (acc, sprint) => acc + sprint.topics.filter((t) => normalizeProjectKey(t.projectKey) === name).length,
      0
    );
    btn.innerHTML = `<strong>${name}</strong><br><small class="muted">${count} topics across sprints</small>`;
    btn.addEventListener("click", () => {
      selectedProjectKey = name;
      render();
    });
    el.sprintsList.appendChild(btn);
  });
}

function renderLeftPanel() {
  const projectsMode = boardView === "projects";
  el.leftPanelTitle.textContent = projectsMode ? "Projects" : "Sprints";
  el.newSprintBtn.classList.toggle("hidden", projectsMode);
  el.leftPanelSearch.classList.toggle("hidden", !projectsMode);
  if (projectsMode) renderProjectsList();
  else renderSprintsList();
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

  const members = getAssignableMembers();
  members.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  if (members.includes(current)) select.value = current;
  else select.value = "";
}

function renderTopicProjectSelect() {
  const select = el.topicProjectSelect;
  if (!select) return;
  const current = select.value;
  select.innerHTML = "";

  const none = document.createElement("option");
  none.value = "";
  none.textContent = "No project";
  select.appendChild(none);

  projectCatalog.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  if (projectCatalog.includes(current)) select.value = current;
  else select.value = "";
}

function renderProjectModalSelect(currentProjectKey = "") {
  const select = el.projectKeySelect;
  if (!select) return;
  select.innerHTML = "";

  const none = document.createElement("option");
  none.value = "";
  none.textContent = "No project";
  select.appendChild(none);

  projectCatalog.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  const normalized = normalizeProjectKey(currentProjectKey);
  select.value = projectCatalog.includes(normalized) ? normalized : "";
}

function visibleSprints() {
  if (boardView === "projects") return state.sprints;
  const active = getActiveSprint();
  return active ? [active] : [];
}

function renderTopics() {
  const activeSprint = getActiveSprint();
  if (!activeSprint) {
    el.boardTitle.textContent = "No sprints yet";
    el.boardMeta.textContent = "Create your first sprint.";
    el.topicsGrid.innerHTML = "";
    return;
  }

  if (boardView === "projects") {
    el.boardTitle.textContent = "All sprints";
    el.boardMeta.textContent = selectedProjectKey
      ? `Project: ${selectedProjectKey}`
      : "Showing activities across every sprint.";
  } else {
    el.boardTitle.textContent = `Sprint ${activeSprint.name}`;
    el.boardMeta.textContent = activeSprint.goal || "No sprint goal defined.";
  }
  el.topicsGrid.innerHTML = "";
  let renderedTopicCount = 0;
  const multiSprintMode = boardView === "projects";
  const canDrag = !multiSprintMode;
  const sprintsToRender = visibleSprints();

  sprintsToRender.forEach((sprint) => {
    sprint.topics.forEach((topic) => {
      normalizeTopic(topic);
      if (boardView === "projects" && selectedProjectKey && topic.projectKey !== selectedProjectKey) return;

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
      const projectText = projectLabel(topic.projectKey);
      node.querySelector(".topic-project").textContent = multiSprintMode
        ? `${projectText} | Sprint ${sprint.name}`
        : projectText;
      node.querySelector(".topic-desc").textContent = topic.description || "No description";
      node.querySelector(".topic-edit-btn").addEventListener("click", () => {
        openProjectModal(
          topic,
          sprint.id,
          ({ title, description, projectKey }) => {
            topic.title = title;
            topic.description = description;
            topic.projectKey = normalizeProjectKey(projectKey);
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
            const itemsToCopy = onlyOpenTasks ? topic.items.filter((item) => !item.done) : topic.items;

            const cloned = {
              id: uid(),
              title: topic.title,
              projectKey: topic.projectKey || "",
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
        emptyHint.textContent = canDrag ? "Drop task here" : "No matching tasks";
        itemsList.appendChild(emptyHint);
      }
      if (canDrag) {
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
      }

      visibleItems.forEach((item) => {
        const li = document.createElement("li");
        li.className = `item ${item.done ? "done" : ""} ${item.priority === "high" ? "item-high" : ""} ${item.blocked ? "item-blocked" : ""}`;
        li.draggable = canDrag;
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

        if (canDrag) {
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
        }

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
  });

  if (renderedTopicCount === 0) {
    const msg = document.createElement("p");
    msg.className = "muted";
    msg.textContent = selectedResponsible
      ? `No tasks found for ${selectedResponsible} in this view.`
      : "No projects found with the current filters.";
    el.topicsGrid.appendChild(msg);
  }
}

function render() {
  if (boardView === "projects" && selectedProjectKey && !projectCatalog.includes(selectedProjectKey)) {
    selectedProjectKey = "";
  }
  el.leftPanelSearch.value = projectSearchText;
  renderLeftPanel();
  renderTopicProjectSelect();
  renderResponsibleFilter();
  renderTopics();
  const projectsMode = boardView === "projects";
  el.newTopicBtn.disabled = projectsMode;
  el.editSprintBtn.disabled = projectsMode;
  el.viewModeBtn.textContent = projectsMode ? "Sprints View" : "Projects View";
  if (projectsMode) {
    el.topicForm.classList.add("hidden");
    el.newTopicBtn.title = "Switch to Sprints View to create projects";
    el.editSprintBtn.title = "Switch to Sprints View to edit sprint";
  } else {
    el.newTopicBtn.title = "";
    el.editSprintBtn.title = "";
  }
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
    projectKey: topic.projectKey || "",
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
  const projectKey = normalizeProjectKey(el.topicProjectSelect.value);
  const description = el.topicDescInput.value.trim();
  if (!title) return;

  sprint.topics.push({ id: uid(), title, projectKey, description, items: [] });
  el.topicTitleInput.value = "";
  el.topicProjectSelect.value = "";
  el.topicDescInput.value = "";
  el.topicForm.classList.add("hidden");
  persistState();
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
    await refreshProjectCatalog();
    try {
      await loadTeamMembersFromFiles();
    } catch {
      // Keep fallback team list if endpoint fails.
    }
    normalizeAllTopics();
    dataMode = "files";
    setStatus("file-based (`tech/sprints/*.md`)");
  } catch (err) {
    state = loadStateLocal();
    normalizeAllTopics();
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
el.pjsBtn.addEventListener("click", openPjsModal);
el.projectsBtn.addEventListener("click", openProjectsModal);
el.viewModeBtn.addEventListener("click", () => {
  if (boardView === "projects") {
    boardView = "sprints";
    projectSearchText = "";
  } else {
    boardView = "projects";
    if (!selectedProjectKey && projectCatalog.length) selectedProjectKey = projectCatalog[0];
  }
  render();
});
el.leftPanelSearch.addEventListener("input", () => {
  projectSearchText = el.leftPanelSearch.value || "";
  render();
});
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
el.teamBtn.addEventListener("click", openTeamModal);

el.newTopicBtn.addEventListener("click", () => {
  if (boardView === "projects") return;
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
  const projectKey = normalizeProjectKey(el.projectKeySelect.value);
  const description = el.projectDescInput.value.trim();
  if (!title) {
    window.alert("Project title cannot be empty.");
    return;
  }
  projectModalOnSave({ title, description, projectKey });
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
el.pjsCloseBtn.addEventListener("click", closePjsModal);
el.pjsAddRowBtn.addEventListener("click", () => {
  pjsEntries.push(createEmptyPjEntry());
  renderPjsRows();
});
el.pjsSaveBtn.addEventListener("click", async () => {
  try {
    const content = pjsToMarkdown(pjsEntries);
    await savePjsFile(content);
    pjsEntries = parsePjsMarkdown(content);
    if (!pjsEntries.length) pjsEntries = [createEmptyPjEntry()];
    renderPjsRows();
    setStatus("file-based (`tech/pjs.md`) - saved");
  } catch (err) {
    window.alert(`Failed to save PJs: ${err.message}`);
  }
});
el.pjsModal.addEventListener("click", (e) => {
  if (e.target === el.pjsModal) closePjsModal();
});
el.teamCloseBtn.addEventListener("click", closeTeamModal);
el.teamNewBtn.addEventListener("click", async () => {
  try {
    await createTeamMemberFlow();
  } catch (err) {
    window.alert(`Failed to create Team member: ${err.message}`);
  }
});
el.teamToggleInactiveBtn.addEventListener("click", async () => {
  try {
    showInactiveTeamMembers = !showInactiveTeamMembers;
    await refreshTeamModalData(currentTeamFile);
  } catch (err) {
    window.alert(`Failed to refresh Team list: ${err.message}`);
  }
});
el.teamMetricsBtn.addEventListener("click", async () => {
  try {
    await openTeamMetrics();
  } catch (err) {
    window.alert(`Failed to open metrics file: ${err.message}`);
  }
});
el.teamDeleteBtn.addEventListener("click", async () => {
  try {
    await inactivateCurrentTeamMember();
  } catch (err) {
    window.alert(`Failed to inactivate Team member: ${err.message}`);
  }
});
el.teamSaveBtn.addEventListener("click", async () => {
  try {
    await saveCurrentTeamMember();
  } catch (err) {
    window.alert(`Failed to save Team member: ${err.message}`);
  }
});
el.teamModal.addEventListener("click", (e) => {
  if (e.target === el.teamModal) closeTeamModal();
});

el.cancelTopicBtn.addEventListener("click", () => {
  el.topicForm.classList.add("hidden");
});

el.topicForm.addEventListener("submit", addTopic);

loadFromFiles();
