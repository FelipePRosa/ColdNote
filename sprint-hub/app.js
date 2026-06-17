const STORAGE_KEY = "sprint_hub_v1";

const PROJECT_STATUS_OPTIONS = ["Planejamento", "Desenvolvimento", "Teste", "Acompanhamento", "Bloqueado", "Finalizado"];
const PROJECT_CONTROL_FILE = "project.json";

const el = {
  sprintsList: document.getElementById("sprintsList"),
  leftPanelTitle: document.getElementById("leftPanelTitle"),
  leftPanelSearch: document.getElementById("leftPanelSearch"),
  boardTitle: document.getElementById("boardTitle"),
  boardMeta: document.getElementById("boardMeta"),
  boardSprintSelect: document.getElementById("boardSprintSelect"),
  boardProjectSelect: document.getElementById("boardProjectSelect"),
  deliveryStartSprintSelect: document.getElementById("deliveryStartSprintSelect"),
  deliveryEndSprintSelect: document.getElementById("deliveryEndSprintSelect"),
  taskSearchInput: document.getElementById("taskSearchInput"),
  responsibleFilter: document.getElementById("responsibleFilter"),
  projectStatusFilter: document.getElementById("projectStatusFilter"),
  backlogProjectFilter: document.getElementById("backlogProjectFilter"),
  newBacklogItemBtn: document.getElementById("newBacklogItemBtn"),
  highOnlyFilter: document.getElementById("highOnlyFilter"),
  blockedOnlyFilter: document.getElementById("blockedOnlyFilter"),
  syncStatus: document.getElementById("syncStatus"),
  topicsGrid: document.getElementById("topicsGrid"),
  backlogList: document.getElementById("backlogList"),
  topicTemplate: document.getElementById("topicTemplate"),
  topicForm: document.getElementById("topicForm"),
  topicTitleInput: document.getElementById("topicTitleInput"),
  topicProjectSelect: document.getElementById("topicProjectSelect"),
  topicStatusSelect: document.getElementById("topicStatusSelect"),
  topicDescInput: document.getElementById("topicDescInput"),
  newTopicBtn: document.getElementById("newTopicBtn"),
  taskboardViewBtn: document.getElementById("taskboardViewBtn"),
  deliveryViewBtn: document.getElementById("deliveryViewBtn"),
  cancelTopicBtn: document.getElementById("cancelTopicBtn"),
  newSprintBtn: document.getElementById("newSprintBtn"),
  editSprintBtn: document.getElementById("editSprintBtn"),
  viewModeBtn: document.getElementById("viewModeBtn"),
  pjsBtn: document.getElementById("pjsBtn"),
  teamBtn: document.getElementById("teamBtn"),
  assigneeModal: document.getElementById("assigneeModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalSubtitle: document.getElementById("modalSubtitle"),
  modalItemText: document.getElementById("modalItemText"),
  modalBacklogProjectField: document.getElementById("modalBacklogProjectField"),
  modalBacklogProjectSelect: document.getElementById("modalBacklogProjectSelect"),
  modalFeatureField: document.getElementById("modalFeatureField"),
  modalFeatureSelect: document.getElementById("modalFeatureSelect"),
  taskMetaRow: document.getElementById("taskMetaRow"),
  modalTaskStatusSelect: document.getElementById("modalTaskStatusSelect"),
  modalHighPriorityCheck: document.getElementById("modalHighPriorityCheck"),
  modalBlockedReasonBlock: document.getElementById("modalBlockedReasonBlock"),
  modalBlockedReasonInput: document.getElementById("modalBlockedReasonInput"),
  modalAssigneeSelect: document.getElementById("modalAssigneeSelect"),
  modalDeleteBtn: document.getElementById("modalDeleteBtn"),
  modalCancelBtn: document.getElementById("modalCancelBtn"),
  modalSaveBtn: document.getElementById("modalSaveBtn"),
  projectModal: document.getElementById("projectModal"),
  projectTitleInput: document.getElementById("projectTitleInput"),
  projectKeySelect: document.getElementById("projectKeySelect"),
  projectStatusSelect: document.getElementById("projectStatusSelect"),
  projectDescInput: document.getElementById("projectDescInput"),
  projectDeliveryBtn: document.getElementById("projectDeliveryBtn"),
  projectFeaturesBtn: document.getElementById("projectFeaturesBtn"),
  projectTimelineBtn: document.getElementById("projectTimelineBtn"),
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
  sprintCopyMdBtn: document.getElementById("sprintCopyMdBtn"),
  sprintSendTeamsBtn: document.getElementById("sprintSendTeamsBtn"),
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
  timelineModal: document.getElementById("timelineModal"),
  timelineTitle: document.getElementById("timelineTitle"),
  timelineSubtitle: document.getElementById("timelineSubtitle"),
  timelineForm: document.getElementById("timelineForm"),
  timelineEventNameInput: document.getElementById("timelineEventNameInput"),
  timelineEventDateInput: document.getElementById("timelineEventDateInput"),
  timelineEventDescInput: document.getElementById("timelineEventDescInput"),
  timelineAddBtn: document.getElementById("timelineAddBtn"),
  timelineList: document.getElementById("timelineList"),
  timelineCloseBtn: document.getElementById("timelineCloseBtn"),
  featuresModal: document.getElementById("featuresModal"),
  featuresTitle: document.getElementById("featuresTitle"),
  featuresSubtitle: document.getElementById("featuresSubtitle"),
  featuresAddBtn: document.getElementById("featuresAddBtn"),
  featuresList: document.getElementById("featuresList"),
  featuresCloseBtn: document.getElementById("featuresCloseBtn"),
  featureEditorModal: document.getElementById("featureEditorModal"),
  featureEditorForm: document.getElementById("featureEditorForm"),
  featureEditorNameInput: document.getElementById("featureEditorNameInput"),
  featureEditorDescInput: document.getElementById("featureEditorDescInput"),
  featureEditorCancelBtn: document.getElementById("featureEditorCancelBtn"),
  featureEditorSaveBtn: document.getElementById("featureEditorSaveBtn"),
  deliveryInfoModal: document.getElementById("deliveryInfoModal"),
  deliveryInfoTitle: document.getElementById("deliveryInfoTitle"),
  deliveryInfoSubtitle: document.getElementById("deliveryInfoSubtitle"),
  deliveryInfoList: document.getElementById("deliveryInfoList"),
  deliveryInfoCloseBtn: document.getElementById("deliveryInfoCloseBtn"),
};

const uid = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const TEAM_METRICS_VIRTUAL_PATH = "__team_metrics__";

let state = {
  activeSprintId: null,
  sprints: [],
  backlog: [],
};

let dataMode = "loading";
let teamMembers = loadTeamMembers();
let itemEditModalOnSave = null;
let itemEditModalOnDelete = null;
let projectModalOnSave = null;
let projectModalOnDelete = null;
let projectModalOnCopy = null;
let projectModalOnTimeline = null;
let projectModalCopyOptions = [];
let copyTargetOnPick = null;
let autoSaveTimer = null;
let autoSaveInFlight = false;
let autoSavePending = false;
let boardView = "sprints";
let taskLayoutView = "projects";
let selectedProjectKey = "";
let projectSearchText = "";
let taskSearchText = "";
let selectedResponsible = "";
let selectedProjectStatus = "";
let selectedBacklogProject = "";
let filterHighOnly = false;
let filterBlockedOnly = false;
let deliveryStartSprintId = "";
let deliveryEndSprintId = "";
let projectCatalog = [];
let projectControls = {};
let projectFeaturesCatalog = {};
let projectsTreeDirs = [];
let projectsTreeFiles = [];
let currentProjectFile = "";
let currentProjectDir = "";
let sprintModalOnSave = null;
let sprintModalOnCopy = null;
let sprintModalOnCopyMd = null;
let sprintModalOnSendTeams = null;
let dragTaskState = null;
let dragProjectKey = "";
let pjsEntries = [];
let teamEntries = [];
let currentTeamFile = "";
let showInactiveTeamMembers = false;
let currentTimelineProjectKey = "";
let currentTimelineEntries = [];
let currentFeaturesProjectKey = "";
let currentFeaturesEntries = [];
let currentFeatureEditId = "";
const modalBackdropState = new WeakMap();
let taskModalBacklogMode = false;
const TEAMS_WEBHOOK_URL = "https://prod-116.westeurope.logic.azure.com:443/workflows/c6390517ac924f61ba70e7695a392fa6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zKA-t3iOYLshX2GQBdol1aVMG4zaDu_H7IzjFVrEsmA";

function setStatus(text) {
  const raw = `Mode: ${text}`;
  const compact = raw
    .replace("file-based (`tech/sprints/*.md`)", "file-based")
    .replace("file-based (`tech/pjs.md`)", "pjs")
    .replace("file-based (`tech/team/*.md`)", "team")
    .replace("localStorage fallback (run `python sprint-hub/server.py` for file mode)", "local fallback");
  el.syncStatus.textContent = compact;
  el.syncStatus.title = raw;
}

function bindBackdropClose(modalEl, onClose) {
  if (!modalEl) return;
  modalEl.addEventListener("pointerdown", (e) => {
    modalBackdropState.set(modalEl, e.target === modalEl);
  });
  modalEl.addEventListener("click", (e) => {
    const startedOnBackdrop = modalBackdropState.get(modalEl);
    modalBackdropState.delete(modalEl);
    if (startedOnBackdrop && e.target === modalEl) onClose();
  });
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
            status: "Desenvolvimento",
            description: "Delivery and quality improvements",
            items: [
              { id: uid(), text: "Finalize dashboard tasks", done: false, responsibles: [] },
              { id: uid(), text: "Close cache optimization", done: true, responsibles: ["Gui"] },
            ],
          },
        ],
      },
    ],
    backlog: [],
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
    parsed.backlog = (parsed.backlog || []).map((item) => normalizeBacklogItem(item));
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
  item.blockedReason = item.blocked ? String(item.blockedReason || "").trim() : "";
  item.followed = Boolean(item.followed);
  item.featureName = String(item.featureName || "").trim();
  item.projectKey = normalizeProjectKey(item.projectKey);
  return item;
}

function normalizeBacklogItem(item) {
  const normalized = normalizeItem({
    ...item,
    id: item?.id || uid(),
    text: String(item?.text || "").trim(),
    done: false,
    responsibles: [],
    priority: "normal",
    blocked: false,
    blockedReason: "",
    projectKey: normalizeProjectKey(item?.projectKey),
    projectTitle: String(item?.projectTitle || "").trim(),
    featureName: String(item?.featureName || "").trim(),
  });
  if (!normalized.projectTitle) {
    normalized.projectTitle = normalized.projectKey || "No project";
  }
  return normalized;
}

function normalizeProjectKey(raw) {
  return String(raw || "").trim().replace(/\s+/g, " ");
}

function normalizeProjectStatus(raw) {
  const value = String(raw || "").trim().toLowerCase();
  if (!value) return "";
  const match = PROJECT_STATUS_OPTIONS.find((status) => status.toLowerCase() === value);
  return match || "";
}

function normalizeStatusClass(status) {
  return normalizeProjectStatus(status)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "none";
}

function normalizeProjectControl(projectKey, raw = {}) {
  return {
    name: normalizeProjectKey(raw.name || projectKey),
    status: normalizeProjectStatus(raw.status),
  };
}

function inferProjectStatusFromSprints(projectKey) {
  const key = normalizeProjectKey(projectKey);
  if (!key) return "";
  for (const sprint of [...state.sprints].reverse()) {
    for (const topic of [...(sprint.topics || [])].reverse()) {
      normalizeTopic(topic);
      if (topic.projectKey === key && topic.status) return topic.status;
    }
  }
  return "";
}

function getProjectCurrentStatus(projectKey) {
  const key = normalizeProjectKey(projectKey);
  if (!key) return "";
  return normalizeProjectStatus(projectControls[key]?.status) || inferProjectStatusFromSprints(key);
}

async function saveProjectControl(projectKey, patch = {}) {
  const key = normalizeProjectKey(projectKey);
  if (!key) return;
  const current = normalizeProjectControl(key, projectControls[key] || {});
  const next = normalizeProjectControl(key, { ...current, ...patch, name: patch.name || current.name || key });
  projectControls[key] = next;
  await saveProjectFile(`${key}/${PROJECT_CONTROL_FILE}`, JSON.stringify(next, null, 2) + "\n");
}

function normalizeTimelineEntry(entry) {
  return {
    id: entry?.id || uid(),
    date: String(entry?.date || "").trim(),
    name: String(entry?.name || "").trim(),
    description: String(entry?.description || "").trim(),
  };
}

function compareTimelineEntries(left, right) {
  const a = normalizeTimelineEntry(left);
  const b = normalizeTimelineEntry(right);
  const dateCompare = String(a.date).localeCompare(String(b.date));
  if (dateCompare !== 0) return dateCompare;
  return String(a.name).localeCompare(String(b.name));
}

function parseTimelineMarkdown(content) {
  const lines = String(content || "").split(/\r?\n/);
  const entries = [];
  let current = null;
  let descLines = [];

  const flush = () => {
    if (!current || !current.date || !current.name) {
      current = null;
      descLines = [];
      return;
    }
    entries.push(
      normalizeTimelineEntry({
        ...current,
        description: descLines.join(" ").trim(),
      })
    );
    current = null;
    descLines = [];
  };

  lines.forEach((raw) => {
    const line = String(raw || "").trimEnd();
    const heading = line.match(/^##\s+(\d{4}-\d{2}-\d{2})\s+\-\s+(.+)$/);
    if (heading) {
      flush();
      current = {
        date: heading[1],
        name: heading[2].trim(),
      };
      return;
    }
    if (!current) return;
    if (!line.trim()) {
      if (descLines.length) descLines.push("");
      return;
    }
    descLines.push(line.trim());
  });

  flush();
  return entries.sort(compareTimelineEntries);
}

function formatTimelineMarkdown(projectKey, entries) {
  const projectName = normalizeProjectKey(projectKey) || "Project";
  const lines = [
    `# Timeline - ${projectName}`,
    "",
    "_Adicione eventos importantes deste projeto aqui para revisar a linha do tempo depois._",
    "",
  ];

  const sorted = [...(entries || [])]
    .map((entry) => normalizeTimelineEntry(entry))
    .filter((entry) => entry.date && entry.name)
    .sort(compareTimelineEntries);

  sorted.forEach((entry) => {
    lines.push(`## ${entry.date} - ${entry.name}`);
    if (entry.description) {
      lines.push(entry.description);
    }
    lines.push("");
  });

  return `${lines.join("\n").trim()}\n`;
}

function formatFeaturesMarkdown(projectKey) {
  const projectName = normalizeProjectKey(projectKey) || "Project";
  const lines = [
    `# Features - ${projectName}`,
    "",
    "_Liste aqui features, capacidades e entregas importantes deste projeto._",
    "",
  ];
  return `${lines.join("\n")}`;
}

function featuresToMarkdown(projectKey, entries) {
  const projectName = normalizeProjectKey(projectKey) || "Project";
  const lines = [
    `# Features - ${projectName}`,
    "",
    "_Liste aqui features, capacidades e entregas importantes deste projeto._",
    "",
  ];

  (entries || [])
    .map((entry) => ({
      name: String(entry?.name || "").trim(),
      description: String(entry?.description || "").trim(),
    }))
    .filter((entry) => entry.name)
    .forEach((entry) => {
      lines.push(`## ${entry.name}`);
      if (entry.description) lines.push(entry.description);
      lines.push("");
    });

  return `${lines.join("\n").trim()}\n`;
}

function parseFeaturesMarkdown(content) {
  const lines = String(content || "").split(/\r?\n/);
  const entries = [];
  let current = null;
  const descLines = [];

  const flush = () => {
    if (!current) return;
    entries.push({
      id: current.id || uid(),
      name: String(current.name || "").trim(),
      description: descLines.join(" ").trim(),
    });
    current = null;
    descLines.length = 0;
  };

  lines.forEach((raw) => {
    const line = String(raw || "").trim();
    if (!line) {
      if (current && descLines.length) descLines.push("");
      return;
    }
    if (/^#\s+/.test(line)) return;
    if (/^_\s*.*\s*_$/i.test(line) && !current) return;
    const featureMatch = line.match(/^##\s+(.+)$/);
    if (featureMatch) {
      flush();
      current = { id: uid(), name: featureMatch[1].trim() };
      return;
    }
    if (current) descLines.push(line);
  });

  flush();
  return entries.filter((entry) => entry.name);
}

function formatTimelineDate(dateText) {
  const raw = String(dateText || "").trim();
  if (!raw) return "";
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return raw;
  return `${match[3]}/${match[2]}/${match[1]}`;
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
  topic.status = normalizeProjectStatus(topic.status);
  topic.description = String(topic.description || "").trim();
  if (!Array.isArray(topic.items)) topic.items = [];
  topic.items = topic.items.map((item) => {
    const normalized = normalizeItem(item);
    normalized.projectKey = topic.projectKey;
    return normalized;
  });
  return topic;
}

function normalizeAllTopics() {
  state.sprints.forEach((sprint) => {
    sprint.topics = (sprint.topics || []).map((topic) => normalizeTopic(topic));
  });
}

function normalizeAllBacklog() {
  state.backlog = (state.backlog || []).map((item) => normalizeBacklogItem(item));
}

function updateProjectCatalogFromTree(dirs, files) {
  projectCatalog = extractRootProjectKeys(dirs, files);
  normalizeAllTopics();
}

async function refreshProjectControls() {
  const next = {};
  await Promise.all(
    projectCatalog.map(async (projectKey) => {
      try {
        const payload = await fetchProjectFile(`${projectKey}/${PROJECT_CONTROL_FILE}`);
        const control = normalizeProjectControl(projectKey, JSON.parse(payload.content || "{}"));
        if (!control.status) control.status = inferProjectStatusFromSprints(projectKey);
        next[projectKey] = control;
      } catch {
        next[projectKey] = normalizeProjectControl(projectKey, {
          name: projectKey,
          status: inferProjectStatusFromSprints(projectKey),
        });
      }
    })
  );
  projectControls = next;
}

async function refreshProjectFeaturesCatalog() {
  const next = {};
  await Promise.all(
    projectCatalog.map(async (projectKey) => {
      try {
        const payload = await fetchProjectFile(`${projectKey}/features.md`);
        next[projectKey] = parseFeaturesMarkdown(payload.content || "");
      } catch {
        next[projectKey] = [];
      }
    })
  );
  projectFeaturesCatalog = next;
}

async function refreshProjectCatalog() {
  try {
    const payload = await fetchProjectsTree();
    updateProjectCatalogFromTree(payload.dirs || [], payload.files || []);
    await refreshProjectControls();
    await refreshProjectFeaturesCatalog();
  } catch {
    projectCatalog = [];
    projectControls = {};
    projectFeaturesCatalog = {};
  }
}

function itemDisplayText(item) {
  const names = (item.responsibles || []).filter(Boolean);
  if (!names.length) return item.text;
  return `${item.text} (${names.join(" + ")})`;
}

function getProjectFeatureEntries(projectKey) {
  const key = normalizeProjectKey(projectKey);
  return key ? [...(projectFeaturesCatalog[key] || [])] : [];
}

function getProjectFeatureNames(projectKey) {
  return getProjectFeatureEntries(projectKey).map((entry) => String(entry?.name || "").trim()).filter(Boolean);
}

function deriveTaskStatus(item = {}, topic = null) {
  if (item?.done) return "done";
  if (item?.blocked) return "blocked";
  const topicStatus = normalizeProjectStatus(topic?.status);
  if (topicStatus === "Desenvolvimento") return "doing";
  if (topicStatus === "Teste") return "testing";
  return "open";
}

function parseItemTextAndResponsibles(rawText) {
  let text = String(rawText || "").trim();
  let priority = "normal";
  let blocked = false;
  let blockedReason = "";
  let followed = false;
  let featureName = "";

  const blockedReasonMatch = text.match(/\[BLOCKED\s*:\s*([^\]]+)\]/i);
  if (blockedReasonMatch) {
    blocked = true;
    blockedReason = String(blockedReasonMatch[1] || "").trim();
  }

  const featureMatch = text.match(/\[FEATURE\s*:\s*([^\]]+)\]/i);
  if (featureMatch) {
    featureName = String(featureMatch[1] || "").trim();
  }

  const metaMatches = text.match(/\[(HIGH|BLOCKED|FOLLOWED)\]/gi) || [];
  metaMatches.forEach((m) => {
    if (/HIGH/i.test(m)) priority = "high";
    if (/BLOCKED/i.test(m)) blocked = true;
    if (/FOLLOWED/i.test(m)) followed = true;
  });
  text = text
    .replace(/\s*\[FEATURE\s*:\s*[^\]]+\]/gi, "")
    .replace(/\s*\[BLOCKED\s*:\s*[^\]]+\]/gi, "")
    .replace(/\s*\[(HIGH|BLOCKED|FOLLOWED)\]/gi, "")
    .trim();

  const m = text.match(/^(.*)\(([^()]*)\)\s*$/);
  if (!m) return { text, responsibles: [], priority, blocked, blockedReason, followed, featureName };

  const body = m[1].trim();
  const namesRaw = m[2].trim();
  if (!/[A-Za-z]/.test(namesRaw)) return { text, responsibles: [], priority, blocked, blockedReason, followed, featureName };

  const responsibles = namesRaw
    .split(/\s*\+\s*|\s*,\s*/)
    .map((x) => x.trim())
    .filter(Boolean);

  if (!responsibles.length) return { text, responsibles: [], priority, blocked, blockedReason, followed, featureName };
  return { text: body || text, responsibles, priority, blocked, blockedReason, followed, featureName };
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
        status: "",
        description: "",
        items: [],
      };
      topics.push(currentTopic);
      continue;
    }

    if (/^- \[[ xX]\]\s+/.test(line)) {
      if (!currentTopic) {
        currentTopic = { id: uid(), title: "Updates", projectKey: "", status: "", description: "", items: [] };
        topics.push(currentTopic);
      }
      const done = /^- \[[xX]\]/.test(line);
      const parsed = parseItemTextAndResponsibles(line.replace(/^- \[[ xX]\]\s+/, "").trim());
        if (parsed.text) {
          currentTopic.items.push({
            id: uid(),
            text: parsed.text,
            done,
            projectKey: currentTopic.projectKey,
            responsibles: parsed.responsibles,
            priority: parsed.priority,
            blocked: parsed.blocked,
            blockedReason: parsed.blockedReason,
          followed: parsed.followed,
          featureName: parsed.featureName,
        });
      }
      continue;
    }

    if (/^- /.test(line)) {
      if (!currentTopic) {
        currentTopic = { id: uid(), title: "Updates", projectKey: "", status: "", description: "", items: [] };
        topics.push(currentTopic);
      }
      const parsed = parseItemTextAndResponsibles(line.replace(/^- /, "").trim());
        if (parsed.text) {
          currentTopic.items.push({
            id: uid(),
            text: parsed.text,
            done: false,
            projectKey: currentTopic.projectKey,
            responsibles: parsed.responsibles,
            priority: parsed.priority,
            blocked: parsed.blocked,
            blockedReason: parsed.blockedReason,
          followed: parsed.followed,
          featureName: parsed.featureName,
        });
      }
      continue;
    }

    if (/^Status:\s*/i.test(line)) {
      if (!currentTopic) {
        currentTopic = { id: uid(), title: "Updates", projectKey: "", status: "", description: "", items: [] };
        topics.push(currentTopic);
      }
      currentTopic.status = normalizeProjectStatus(line.replace(/^Status:\s*/i, "").trim());
      continue;
    }

    if (!currentTopic) {
      currentTopic = { id: uid(), title: "Updates", projectKey: "", status: "", description: "", items: [] };
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
    if (topic.status) lines.push(`Status: ${normalizeProjectStatus(topic.status)}`);
    if (topic.description) lines.push(topic.description, "");
    else if (topic.status) lines.push("");

    if (!topic.items.length) {
      lines.push("- [ ] (no items)", "");
      return;
    }

    topic.items.forEach((item) => {
      let lineText = itemDisplayText(item);
      if (item.featureName) lineText += ` [FEATURE: ${String(item.featureName).replace(/\]/g, ")")}]`;
      if (item.priority === "high") lineText += " [HIGH]";
      if (item.blocked) {
        const blockedReason = String(item.blockedReason || "").trim().replace(/\]/g, ")");
        lineText += blockedReason ? ` [BLOCKED: ${blockedReason}]` : " [BLOCKED]";
      }
      if (item.followed) lineText += " [FOLLOWED]";
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

async function fetchProjectTimeline(projectKey) {
  const relPath = `${normalizeProjectKey(projectKey)}/timeline.md`;
  try {
    return await fetchProjectFile(relPath);
  } catch (err) {
    if (!normalizeProjectKey(projectKey)) throw err;
    const content = formatTimelineMarkdown(projectKey, []);
    await saveProjectFile(relPath, content);
    return { path: relPath, content };
  }
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

async function saveProjectTimeline(projectKey, entries) {
  const relPath = `${normalizeProjectKey(projectKey)}/timeline.md`;
  const content = formatTimelineMarkdown(projectKey, entries);
  await saveProjectFile(relPath, content);
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
  await saveProjectControl(rel, { name: rel, status: "" });
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
    backlog: (state.backlog || []).map((item) => ({
      ...normalizeBacklogItem(item),
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

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

async function copyActiveSprintMarkdown() {
  const sprint = getActiveSprint();
  if (!sprint) {
    window.alert("No active sprint selected.");
    return;
  }
  const content = sprintToMarkdown(sprint);
  await copyTextToClipboard(content);
  setStatus(`sprint markdown copied (${sprint.name})`);
}

async function sendActiveSprintMarkdownToTeams() {
  const sprint = getActiveSprint();
  if (!sprint) {
    window.alert("No active sprint selected.");
    return;
  }
  const message = sprintToMarkdown(sprint);
  const res = await fetch(TEAMS_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target: "Tech Innovation - Lead Team",
      message,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  setStatus(`teams sent (${sprint.name})`);
}

function getActiveSprint() {
  const sprint = state.sprints.find((s) => s.id === state.activeSprintId);
  return sprint || state.sprints[0] || null;
}

function beginTopicTaskDrag(topicId, itemId) {
  dragTaskState = { sourceType: "topic", topicId, itemId };
}

function beginBacklogTaskDrag(itemId) {
  dragTaskState = { sourceType: "backlog", itemId };
}

function endTaskDrag() {
  dragTaskState = null;
}

function removeDraggedTaskFromSource() {
  if (!dragTaskState) return false;
  if (dragTaskState.sourceType === "backlog") {
    const sourceIndex = state.backlog.findIndex((item) => item.id === dragTaskState.itemId);
    if (sourceIndex < 0) return null;
    const [movedItem] = state.backlog.splice(sourceIndex, 1);
    return movedItem || null;
  }

  const sprint = getActiveSprint();
  if (!sprint) return null;

  const sourceTopic = sprint.topics.find((t) => t.id === dragTaskState.topicId);
  if (!sourceTopic) return null;
  const sourceIndex = sourceTopic.items.findIndex((i) => i.id === dragTaskState.itemId);
  if (sourceIndex < 0) return null;

  const [movedItem] = sourceTopic.items.splice(sourceIndex, 1);
  return movedItem || null;
}

function moveDraggedTaskToTopic(targetTopicId, beforeItemId = null) {
  if (!dragTaskState) return false;
  const sprint = getActiveSprint();
  if (!sprint) return false;

  let targetTopic = sprint.topics.find((t) => t.id === targetTopicId);
  if (!targetTopic) return false;

  const sourceTopic =
    dragTaskState.sourceType === "topic"
      ? sprint.topics.find((t) => t.id === dragTaskState.topicId)
      : null;
  const sourceIndex =
    dragTaskState.sourceType === "topic"
      ? sourceTopic?.items.findIndex((i) => i.id === dragTaskState.itemId) ?? -1
      : -1;
  const movedItem = removeDraggedTaskFromSource();
  if (!movedItem) return false;

  if (dragTaskState.sourceType === "backlog") {
    const backlogProjectKey = normalizeProjectKey(movedItem.projectKey);
    if (backlogProjectKey) {
      const matchedTopic = sprint.topics.find((topic) => normalizeProjectKey(topic.projectKey) === backlogProjectKey);
      if (matchedTopic) {
        targetTopic = matchedTopic;
        beforeItemId = null;
      }
    }
  }

  let insertIndex = targetTopic.items.length;
  if (beforeItemId) {
    const idx = targetTopic.items.findIndex((i) => i.id === beforeItemId);
    if (idx >= 0) insertIndex = idx;
  }

  if (sourceTopic && sourceTopic.id === targetTopic.id && insertIndex > sourceIndex) {
    insertIndex -= 1;
  }

  targetTopic.items.splice(Math.max(0, insertIndex), 0, normalizeItem(movedItem));
  persistState();
  render();
  return true;
}

function moveDraggedTaskToBacklog(beforeItemId = null) {
  if (!dragTaskState) return false;

  if (dragTaskState.sourceType === "topic") {
    const sprint = getActiveSprint();
    if (!sprint) return false;
    const sourceTopic = sprint.topics.find((t) => t.id === dragTaskState.topicId);
    if (!sourceTopic) return false;
    const movedItem = removeDraggedTaskFromSource();
    if (!movedItem) return false;
    const backlogItem = normalizeBacklogItem({
      ...movedItem,
      projectKey: sourceTopic.projectKey || normalizeProjectKey(sourceTopic.title),
      projectTitle: sourceTopic.title || sourceTopic.projectKey || "No project",
    });
    let insertIndex = state.backlog.length;
    if (beforeItemId) {
      const idx = state.backlog.findIndex((item) => item.id === beforeItemId);
      if (idx >= 0) insertIndex = idx;
    }
    state.backlog.splice(Math.max(0, insertIndex), 0, backlogItem);
  } else {
    const sourceIndex = state.backlog.findIndex((item) => item.id === dragTaskState.itemId);
    if (sourceIndex < 0) return false;
    const [movedItem] = state.backlog.splice(sourceIndex, 1);
    if (!movedItem) return false;
    let insertIndex = state.backlog.length;
    if (beforeItemId) {
      const idx = state.backlog.findIndex((item) => item.id === beforeItemId);
      if (idx >= 0) insertIndex = idx;
    }
    if (beforeItemId && insertIndex > sourceIndex) insertIndex -= 1;
    state.backlog.splice(Math.max(0, insertIndex), 0, movedItem);
  }

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

function openTaskModal({
  title,
  subtitle,
  saveLabel,
  currentText,
  currentNames,
  currentProjectKey = "",
  currentFeatureName = "",
  featureProjectKey = "",
  currentStatus = "open",
  onSave,
  onDelete = null,
  backlogMode = false,
}) {
  itemEditModalOnSave = onSave;
  itemEditModalOnDelete = onDelete;
  taskModalBacklogMode = backlogMode;
  el.modalTitle.textContent = title || "Edit Task";
  el.modalSubtitle.textContent = subtitle || "Update task text and responsibles.";
  el.modalSaveBtn.textContent = saveLabel || "Apply";
  el.modalItemText.value = currentText?.text || "";
  el.modalTaskStatusSelect.value = currentStatus || "open";
  el.modalHighPriorityCheck.checked = currentText?.priority === "high";
  el.modalBlockedReasonInput.value = currentText?.blockedReason || "";
  const blockedSelected = (currentStatus || "open") === "blocked";
  el.modalBlockedReasonInput.disabled = !blockedSelected;
  el.modalBlockedReasonBlock.classList.toggle("hidden", !blockedSelected);
  el.modalAssigneeSelect.innerHTML = "";

  getAssignableMembers().forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    option.selected = currentNames.includes(name);
    el.modalAssigneeSelect.appendChild(option);
  });

  renderBacklogModalProjectSelect(currentProjectKey);
  renderTaskModalFeatureSelect(backlogMode ? currentProjectKey : featureProjectKey, currentFeatureName);
  el.modalBacklogProjectField.classList.add("hidden");
  el.taskMetaRow.classList.toggle("hidden", backlogMode);
  el.modalBlockedReasonInput.classList.toggle("hidden", backlogMode || !blockedSelected);
  el.modalAssigneeSelect.classList.toggle("hidden", backlogMode);
  el.modalFeatureField.classList.toggle(
    "hidden",
    getProjectFeatureNames(backlogMode ? currentProjectKey : featureProjectKey).length === 0
  );
  el.modalDeleteBtn.classList.toggle("hidden", !onDelete);

  el.assigneeModal.classList.remove("hidden");
}

function closeAssigneeModal() {
  el.assigneeModal.classList.add("hidden");
  el.modalBacklogProjectField.classList.add("hidden");
  el.modalFeatureField.classList.add("hidden");
  el.taskMetaRow.classList.remove("hidden");
  el.modalAssigneeSelect.classList.remove("hidden");
  el.modalDeleteBtn.classList.add("hidden");
  el.modalBlockedReasonInput.classList.remove("hidden");
  taskModalBacklogMode = false;
  itemEditModalOnSave = null;
  itemEditModalOnDelete = null;
}

function renderTimelineEntries() {
  el.timelineList.innerHTML = "";
  if (!currentTimelineEntries.length) {
    const empty = document.createElement("div");
    empty.className = "timeline-empty";
    empty.textContent = "No timeline events yet for this project.";
    el.timelineList.appendChild(empty);
    return;
  }

  currentTimelineEntries
    .slice()
    .sort(compareTimelineEntries)
    .forEach((entry) => {
      const node = document.createElement("article");
      node.className = "timeline-entry";
      node.innerHTML = `
        <div class="timeline-entry-head">
          <h4 class="timeline-entry-title"></h4>
          <span class="timeline-entry-date"></span>
        </div>
        <p class="timeline-entry-desc"></p>
      `;
      node.querySelector(".timeline-entry-title").textContent = entry.name;
      node.querySelector(".timeline-entry-date").textContent = formatTimelineDate(entry.date);
      const desc = node.querySelector(".timeline-entry-desc");
      desc.textContent = entry.description || "No description";
      el.timelineList.appendChild(node);
    });
}

async function openTimelineModal(projectKey) {
  const normalized = normalizeProjectKey(projectKey);
  if (!normalized) {
    window.alert("Select a project folder first.");
    return;
  }
  const payload = await fetchProjectTimeline(normalized);
  currentTimelineProjectKey = normalized;
  currentTimelineEntries = parseTimelineMarkdown(payload.content);
  el.timelineTitle.textContent = `Timeline - ${normalized}`;
  el.timelineSubtitle.textContent = `Review and add important events for ${normalized}.`;
  el.timelineEventNameInput.value = "";
  el.timelineEventDateInput.value = "";
  el.timelineEventDescInput.value = "";
  renderTimelineEntries();
  el.timelineModal.classList.remove("hidden");
}

function closeTimelineModal() {
  el.timelineModal.classList.add("hidden");
  currentTimelineProjectKey = "";
  currentTimelineEntries = [];
}

function renderFeaturesEntries() {
  el.featuresList.innerHTML = "";
  if (!currentFeaturesEntries.length) {
    const empty = document.createElement("div");
    empty.className = "timeline-empty";
    empty.textContent = "No features registered for this project yet.";
    el.featuresList.appendChild(empty);
    return;
  }

  currentFeaturesEntries.forEach((entry) => {
    const node = document.createElement("article");
    node.className = "timeline-entry";
    node.innerHTML = `
      <div class="timeline-entry-head">
        <h4 class="timeline-entry-title"></h4>
        <button type="button" class="btn-link btn-link-neutral feature-entry-edit" aria-label="Edit feature" title="Edit feature">✎</button>
      </div>
      <p class="timeline-entry-desc"></p>
    `;
    node.querySelector(".timeline-entry-title").textContent = entry.name;
    node.querySelector(".timeline-entry-desc").textContent = entry.description || "No description";
    node.querySelector(".feature-entry-edit").addEventListener("click", () => {
      openFeatureEditorModal(entry);
    });
    el.featuresList.appendChild(node);
  });
}

async function openFeaturesModal(projectKey) {
  const normalized = normalizeProjectKey(projectKey);
  if (!normalized) {
    window.alert("Select a project folder first.");
    return;
  }
  const relPath = `${normalized}/features.md`;
  let payload;
  try {
    payload = await fetchProjectFile(relPath);
  } catch {
    const content = formatFeaturesMarkdown(normalized);
    await saveProjectFile(relPath, content);
    await refreshProjectsModalData();
    payload = await fetchProjectFile(relPath);
  }
  currentFeaturesProjectKey = normalized;
  currentFeaturesEntries = parseFeaturesMarkdown(payload.content || "");
  projectFeaturesCatalog[normalized] = [...currentFeaturesEntries];
  el.featuresTitle.textContent = `Features - ${normalized}`;
  el.featuresSubtitle.textContent = "Review project features and descriptions.";
  renderFeaturesEntries();
  el.featuresModal.classList.remove("hidden");
}

function closeFeaturesModal() {
  el.featuresModal.classList.add("hidden");
  currentFeaturesProjectKey = "";
  currentFeaturesEntries = [];
  el.featuresList.innerHTML = "";
}

function openFeatureEditorModal(entry = null) {
  if (!normalizeProjectKey(currentFeaturesProjectKey)) {
    window.alert("Open a project features view first.");
    return;
  }
  currentFeatureEditId = String(entry?.id || "").trim();
  el.featureEditorNameInput.value = entry?.name || "";
  el.featureEditorDescInput.value = entry?.description || "";
  el.featureEditorSaveBtn.textContent = currentFeatureEditId ? "Save Feature" : "Add Feature";
  el.featureEditorModal.classList.remove("hidden");
  el.featureEditorNameInput.focus();
}

function closeFeatureEditorModal() {
  el.featureEditorModal.classList.add("hidden");
  el.featureEditorNameInput.value = "";
  el.featureEditorDescInput.value = "";
  el.featureEditorSaveBtn.textContent = "Add Feature";
  currentFeatureEditId = "";
}

function openDeliveryInfoModal({ title, subtitle = "", groups = [] }) {
  el.deliveryInfoTitle.textContent = title;
  el.deliveryInfoSubtitle.textContent = subtitle;
  el.deliveryInfoList.innerHTML = "";

  if (!groups.length) {
    const empty = document.createElement("div");
    empty.className = "timeline-empty";
    empty.textContent = "No details available.";
    el.deliveryInfoList.appendChild(empty);
  }

  groups.forEach((group) => {
    const section = document.createElement("article");
    section.className = "delivery-info-section";
    section.innerHTML = `
      <div class="delivery-info-section-head">
        <strong></strong>
        <span></span>
      </div>
      <ul></ul>
    `;
    section.querySelector("strong").textContent = group.title || "Details";
    section.querySelector("span").textContent = group.meta || "";
    const list = section.querySelector("ul");
    (group.items || []).forEach((entry) => {
      const li = document.createElement("li");
      if (typeof entry === "string") {
        li.textContent = entry;
      } else {
        li.textContent = entry?.text || "";
        if (typeof entry?.onClick === "function") {
          li.classList.add("delivery-info-clickable");
          li.addEventListener("click", () => {
            closeDeliveryInfoModal();
            entry.onClick();
          });
        }
      }
      list.appendChild(li);
    });
    el.deliveryInfoList.appendChild(section);
  });

  el.deliveryInfoModal.classList.remove("hidden");
}

function closeDeliveryInfoModal() {
  el.deliveryInfoModal.classList.add("hidden");
  el.deliveryInfoList.innerHTML = "";
}

function openProjectModal(topic, currentSprintId, onSave, onDelete, onCopy, onTimeline) {
  projectModalOnSave = onSave;
  projectModalOnDelete = onDelete || null;
  projectModalOnCopy = onCopy || null;
  projectModalOnTimeline = onTimeline || null;
  el.projectTitleInput.value = topic.title || "";
  renderProjectModalSelect(topic.projectKey || "");
  renderProjectStatusSelect(topic.status || "");
  el.projectDescInput.value = topic.description || "";
  el.projectDeleteBtn.classList.toggle("hidden", !projectModalOnDelete);
  projectModalCopyOptions = state.sprints.filter((s) => s.id !== currentSprintId);
  const canCopy = Boolean(projectModalOnCopy) && projectModalCopyOptions.length > 0;
  el.projectCopyBtn.disabled = !canCopy;
  el.projectDeliveryBtn.disabled = !normalizeProjectKey(topic.projectKey);
  el.projectFeaturesBtn.disabled = !normalizeProjectKey(topic.projectKey);
  el.projectTimelineBtn.disabled = !normalizeProjectKey(topic.projectKey) || !projectModalOnTimeline;
  el.projectModal.classList.remove("hidden");
}

function closeProjectModal() {
  el.projectModal.classList.add("hidden");
  projectModalOnSave = null;
  projectModalOnDelete = null;
  projectModalOnCopy = null;
  projectModalOnTimeline = null;
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

function openSprintModal(sprint, onSave, onCopy, onCopyMd, onSendTeams) {
  sprintModalOnSave = onSave;
  sprintModalOnCopy = onCopy;
  sprintModalOnCopyMd = onCopyMd;
  sprintModalOnSendTeams = onSendTeams;
  el.sprintNameInput.value = sprint?.name || "";
  el.sprintGoalInput.value = sprint?.goal || "";
  el.sprintModal.classList.remove("hidden");
}

function closeSprintModal() {
  el.sprintModal.classList.add("hidden");
  sprintModalOnSave = null;
  sprintModalOnCopy = null;
  sprintModalOnCopyMd = null;
  sprintModalOnSendTeams = null;
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
  await refreshProjectControls();
  await refreshProjectFeaturesCatalog();
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

async function openProjectSupportFile(projectKey, fileName) {
  const normalized = normalizeProjectKey(projectKey);
  if (!normalized) {
    window.alert("Select a project folder first.");
    return;
  }
  await refreshProjectsModalData();
  const relPath = `${normalized}/${fileName}`;
  try {
    await openProjectFile(relPath);
  } catch (err) {
    if (fileName === "features.md") {
      await saveProjectFile(relPath, formatFeaturesMarkdown(normalized));
      await refreshProjectsModalData();
      await openProjectFile(relPath);
    } else {
      throw err;
    }
  }
  el.projectsModal.classList.remove("hidden");
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
  if (!el.sprintsList) return;
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
  if (!el.sprintsList) return;
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
  if (!el.leftPanelTitle || !el.leftPanelSearch || !el.sprintsList) return;
  const projectsMode = boardView === "projects";
  el.leftPanelTitle.textContent = projectsMode ? "Projects" : "Sprints";
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

function renderProjectStatusFilter() {
  const select = el.projectStatusFilter;
  if (!select) return;

  select.innerHTML = "";

  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = "Status";
  select.appendChild(allOpt);

  PROJECT_STATUS_OPTIONS.forEach((status) => {
    const opt = document.createElement("option");
    opt.value = status;
    opt.textContent = status;
    select.appendChild(opt);
  });

  select.value = normalizeProjectStatus(selectedProjectStatus);
}

function renderTaskFilterVisibility() {
  const projectsMode = boardView === "projects";
  el.responsibleFilter?.classList.toggle("hidden", projectsMode);
  if (el.responsibleFilter) el.responsibleFilter.disabled = projectsMode;

  [el.highOnlyFilter, el.blockedOnlyFilter].forEach((input) => {
    const control = input?.closest(".quick-filter");
    control?.classList.toggle("hidden", projectsMode);
    if (input) input.disabled = projectsMode;
  });
}

function renderBoardSprintSelect() {
  const select = el.boardSprintSelect;
  if (!select) return;
  select.innerHTML = "";

  state.sprints.forEach((sprint) => {
    const option = document.createElement("option");
    option.value = sprint.id;
    option.textContent = `Sprint ${sprint.name}`;
    select.appendChild(option);
  });

  const active = getActiveSprint();
  select.value = active?.id || "";
  select.classList.toggle("hidden", boardView === "projects" || state.sprints.length === 0);
  select.disabled = boardView === "projects" || state.sprints.length === 0;
}

function sprintIndexById(sprintId) {
  return state.sprints.findIndex((sprint) => sprint.id === sprintId);
}

function getDeliverySprintRange(sourceSprints = state.sprints) {
  if (!sourceSprints.length) return [];
  const startIndex = sprintIndexById(deliveryStartSprintId);
  const endIndex = sprintIndexById(deliveryEndSprintId);
  const rawStart = startIndex >= 0 ? startIndex : 0;
  const rawEnd = endIndex >= 0 ? endIndex : state.sprints.length - 1;
  const minIndex = Math.min(rawStart, rawEnd);
  const maxIndex = Math.max(rawStart, rawEnd);
  const allowedIds = new Set(state.sprints.slice(minIndex, maxIndex + 1).map((sprint) => sprint.id));
  return sourceSprints.filter((sprint) => allowedIds.has(sprint.id));
}

function renderDeliverySprintSelect(select, currentValue, placeholder) {
  if (!select) return;
  select.innerHTML = "";

  const all = document.createElement("option");
  all.value = "";
  all.textContent = placeholder;
  select.appendChild(all);

  state.sprints.forEach((sprint) => {
    const option = document.createElement("option");
    option.value = sprint.id;
    option.textContent = `Sprint ${sprint.name}`;
    select.appendChild(option);
  });

  select.value = state.sprints.some((sprint) => sprint.id === currentValue) ? currentValue : "";
}

function renderDeliverySprintRangeSelects() {
  const deliveryMode = boardView === "projects" && taskLayoutView === "delivery";
  renderDeliverySprintSelect(el.deliveryStartSprintSelect, deliveryStartSprintId, "Start sprint");
  renderDeliverySprintSelect(el.deliveryEndSprintSelect, deliveryEndSprintId, "End sprint");

  [el.deliveryStartSprintSelect, el.deliveryEndSprintSelect].forEach((select) => {
    if (!select) return;
    select.classList.toggle("hidden", !deliveryMode || state.sprints.length === 0);
    select.disabled = !deliveryMode || state.sprints.length === 0;
  });
}

function renderBoardProjectSelect() {
  const select = el.boardProjectSelect;
  if (!select) return;
  select.innerHTML = "";

  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All projects";
  select.appendChild(all);

  projectCatalog.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });

  select.value = projectCatalog.includes(selectedProjectKey) ? selectedProjectKey : "";
  const hidden = boardView !== "projects" || taskLayoutView === "taskboard";
  select.classList.toggle("hidden", hidden);
  select.disabled = hidden;
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

function renderBacklogModalProjectSelect(currentProjectKey = "") {
  const select = el.modalBacklogProjectSelect;
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

function renderTaskModalFeatureSelect(projectKey = "", currentFeatureName = "") {
  const select = el.modalFeatureSelect;
  const field = el.modalFeatureField;
  if (!select || !field) return;

  const features = getProjectFeatureNames(projectKey);
  select.innerHTML = "";

  const none = document.createElement("option");
  none.value = "";
  none.textContent = "No feature";
  select.appendChild(none);

  features.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  const normalizedFeature = String(currentFeatureName || "").trim();
  select.value = features.includes(normalizedFeature) ? normalizedFeature : "";
  field.classList.toggle("hidden", features.length === 0);
}

function fillStatusSelect(select, currentStatus = "") {
  if (!select) return;
  const previousEmptyOption = select.querySelector('option[value=""]');
  select.innerHTML = "";

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = previousEmptyOption?.textContent || "No status";
  select.appendChild(empty);

  PROJECT_STATUS_OPTIONS.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    select.appendChild(option);
  });

  select.value = normalizeProjectStatus(currentStatus);
}

function renderTopicStatusSelect(currentStatus = "") {
  fillStatusSelect(el.topicStatusSelect, currentStatus);
}

function renderProjectStatusSelect(currentStatus = "") {
  fillStatusSelect(el.projectStatusSelect, currentStatus);
}

function backlogProjectId(item) {
  return normalizeProjectKey(item?.projectKey || item?.projectTitle);
}

function backlogProjectLabel(item) {
  return String(item?.projectTitle || item?.projectKey || "No project").trim();
}

function backlogItemMetaLabel(item) {
  const project = backlogProjectLabel(item);
  const feature = String(item?.featureName || "").trim();
  return feature ? `${project} | ${feature}` : project;
}

function renderBacklogProjectFilter() {
  const select = el.backlogProjectFilter;
  if (!select) return;

  select.innerHTML = "";
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "Todos projetos";
  select.appendChild(all);

  const projects = new Map();
  (state.backlog || []).forEach((item) => {
    const id = backlogProjectId(item);
    const label = backlogProjectLabel(item);
    if (!id || projects.has(id)) return;
    projects.set(id, label);
  });

  Array.from(projects.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .forEach(([id, label]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = label;
      select.appendChild(option);
    });

  select.value = projects.has(selectedBacklogProject) ? selectedBacklogProject : "";
}

function renderBacklog() {
  const list = el.backlogList;
  if (!list) return;
  list.innerHTML = "";

  const items = (state.backlog || []).filter((item) => {
    if (selectedBacklogProject && backlogProjectId(item) !== selectedBacklogProject) return false;
    return backlogItemMatchesSearch(item);
  });

  if (!items.length) {
    list.classList.add("empty-drop-zone");
    const empty = document.createElement("li");
    empty.className = "item-empty-hint";
    empty.textContent = taskSearchText
      ? `No backlog tasks found for "${taskSearchText}"`
      : selectedBacklogProject
        ? "No backlog tasks for this project"
        : "Drop tasks here";
    list.appendChild(empty);
  } else {
    list.classList.remove("empty-drop-zone");
  }

  list.ondragover = (e) => {
    if (!dragTaskState) return;
    e.preventDefault();
    list.classList.add("drop-active");
  };
  list.ondragleave = (e) => {
    if (e.relatedTarget && list.contains(e.relatedTarget)) return;
    list.classList.remove("drop-active");
  };
  list.ondrop = (e) => {
    e.preventDefault();
    list.classList.remove("drop-active");
    moveDraggedTaskToBacklog(null);
    endTaskDrag();
  };

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "backlog-item";
    li.draggable = true;
    li.innerHTML = `
      <div class="item-project-meta"></div>
      <div class="backlog-item-text"></div>
    `;
    li.querySelector(".backlog-item-text").textContent = itemDisplayText(item);
    li.querySelector(".item-project-meta").textContent = backlogItemMetaLabel(item);

    li.addEventListener("dragstart", (e) => {
      beginBacklogTaskDrag(item.id);
      li.classList.add("dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", item.id);
      }
    });
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      document.querySelectorAll(".item.drop-before, .backlog-item.drop-before").forEach((x) => x.classList.remove("drop-before"));
      document.querySelectorAll(".items-list.drop-active, .backlog-list.drop-active").forEach((x) => x.classList.remove("drop-active"));
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
      moveDraggedTaskToBacklog(item.id);
      endTaskDrag();
    });

    li.addEventListener("click", (e) => {
      openTaskModal({
        title: "Edit Backlog Task",
        subtitle: "Update only the task text for backlog.",
        saveLabel: "Apply",
        currentText: { text: item.text, priority: item.priority, blocked: item.blocked, blockedReason: item.blockedReason },
        currentNames: item.responsibles || [],
        currentProjectKey: item.projectKey || "",
        currentFeatureName: item.featureName || "",
        onDelete: () => {
          state.backlog = state.backlog.filter((x) => x.id !== item.id);
          persistState();
          render();
        },
        backlogMode: true,
        onSave: ({ text, projectKey, featureName }) => {
          item.text = text;
          item.projectKey = normalizeProjectKey(projectKey);
          item.projectTitle = item.projectKey || "No project";
          item.featureName = String(featureName || "").trim();
          item.responsibles = [];
          item.priority = "normal";
          item.blocked = false;
          item.blockedReason = "";
          persistState();
          render();
        },
      });
    });

    list.appendChild(li);
  });
}

function visibleSprints() {
  if (boardView === "projects") return [...state.sprints].reverse();
  const active = getActiveSprint();
  return active ? [active] : [];
}

function normalizeSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function searchHaystack(values) {
  return values
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
}

function backlogItemMatchesSearch(item) {
  const query = normalizeSearchText(taskSearchText);
  if (!query) return true;

  return searchHaystack([
    item.text,
    ...(item.responsibles || []),
    item.featureName,
    item.projectKey,
    item.projectTitle,
    backlogProjectLabel(item),
  ]).includes(query);
}

function taskMatchesSearch(item, topic, sprint) {
  const query = normalizeSearchText(taskSearchText);
  if (!query) return true;

  return searchHaystack([
    item.text,
    item.featureName,
    ...(item.responsibles || []),
    item.blockedReason,
    topic.title,
    topic.description,
    topic.projectKey,
    sprint.name,
  ]).includes(query);
}

function taskPassesBoardFilters(item, topic, sprint) {
  normalizeItem(item);
  if (!taskMatchesSearch(item, topic, sprint)) return false;
  if (selectedResponsible && !(item.responsibles || []).includes(selectedResponsible)) return false;
  if (filterHighOnly && item.priority !== "high") return false;
  if (filterBlockedOnly && !item.blocked) return false;
  return true;
}

function projectTaskDedupeKey(item) {
  return normalizeSearchText(item?.text || itemDisplayText(item));
}

function latestProjectTaskEntries(entries) {
  const sprintOrder = new Map(state.sprints.map((entry, index) => [entry.id, index]));
  const latestByTask = new Map();

  entries.forEach((entry) => {
    const taskKey = projectTaskDedupeKey(entry.item);
    if (!taskKey) return;
    const currentOrder = sprintOrder.get(entry.sprint.id) ?? -1;
    const previous = latestByTask.get(taskKey);
    const previousOrder = previous ? (sprintOrder.get(previous.sprint.id) ?? -1) : -1;
    if (!previous || currentOrder >= previousOrder) {
      latestByTask.set(taskKey, entry);
    }
  });

  return Array.from(latestByTask.values());
}

function collectProjectFeatureSummaries({ projectFilter = selectedProjectKey, statusFilter = selectedProjectStatus } = {}) {
  const projects = new Map();

  visibleSprints().forEach((sprint) => {
    sprint.topics.forEach((topic) => {
      normalizeTopic(topic);
      const projectKey = normalizeProjectKey(topic.projectKey);
      if (!projectKey) return;
      if (projectFilter && projectKey !== projectFilter) return;
      const projectStatus = getProjectCurrentStatus(projectKey);
      if (statusFilter && projectStatus !== statusFilter) return;

      const project = projects.get(projectKey) || {
        projectKey,
        title: projectLabel(projectKey),
        status: projectStatus,
        description: topic.description || "",
        latestSprint: sprint,
        latestTopic: topic,
        taskEntries: [],
        features: new Map(),
      };

      project.status = projectStatus || project.status;
      if (!project.description && topic.description) project.description = topic.description;
      const latestIndex = state.sprints.findIndex((entry) => entry.id === project.latestSprint?.id);
      const currentIndex = state.sprints.findIndex((entry) => entry.id === sprint.id);
      if (currentIndex >= latestIndex) {
        project.latestSprint = sprint;
        project.latestTopic = topic;
      }

      topic.items.forEach((item) => {
        project.taskEntries.push({ sprint, topic, item });
      });

      projects.set(projectKey, project);
    });
  });

  const filtersActive = Boolean(taskSearchText);
  return Array.from(projects.values())
    .map((project) => {
      latestProjectTaskEntries(project.taskEntries)
        .filter(({ item, topic, sprint }) => taskMatchesSearch(item, topic, sprint))
        .forEach((entry) => {
          const featureLabel = String(entry.item.featureName || "").trim() || "Outros";
          const feature = project.features.get(featureLabel) || { label: featureLabel, entries: [] };
          feature.entries.push(entry);
          project.features.set(featureLabel, feature);
        });
      return project;
    })
    .filter((project) => {
      if (project.features.size > 0) return true;
      return !filtersActive && Boolean(project.description);
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function appendProjectFeatureItems(itemsList, project) {
  Array.from(project.features.values())
    .sort((a, b) => a.label.localeCompare(b.label))
    .forEach((feature) => {
      const allDone = feature.entries.length > 0 && feature.entries.every(({ item }) => item.done);
      const featureStatus = allDone ? "Closed" : "Active";
      const li = document.createElement("li");
      li.className = "item project-feature-item";
      li.innerHTML = `
        <span class="item-line">
          <span class="item-text"></span>
          <span class="tag feature-status-tag"></span>
          <span class="tag"></span>
        </span>
        <div>
          <button type="button" class="btn-link btn-link-neutral item-edit" aria-label="Open feature tasks" title="Open feature tasks">↗</button>
        </div>
      `;
      li.querySelector(".item-text").textContent = feature.label;
      li.querySelector(".feature-status-tag").textContent = featureStatus;
      li.querySelector(".feature-status-tag").dataset.state = allDone ? "closed" : "active";
      li.querySelector(".tag:last-of-type").textContent = `${feature.entries.length} task${feature.entries.length === 1 ? "" : "s"}`;
      const openFeature = () => {
        const items = feature.entries
          .sort((a, b) => (a.item.text || "").localeCompare(b.item.text || ""))
          .map(({ topic, item }) => {
            const status = item.done ? "Closed" : "Active";
            const responsibles = item.responsibles?.length ? item.responsibles.join(" + ") : "No responsible";
            return {
              text: `${itemDisplayText(item)} | ${status} | ${responsibles}`,
              onClick: () => openTopicTaskEditor(topic, item),
            };
          });
        openDeliveryInfoModal({
          title: feature.label,
          subtitle: project.title,
          groups: [{ title: "Tasks", meta: `${items.length} current`, items }],
        });
      };
      li.addEventListener("click", openFeature);
      li.querySelector(".item-edit").addEventListener("click", (e) => {
        e.stopPropagation();
        openFeature();
      });
      itemsList.appendChild(li);
    });
}

function openTopicTaskEditor(topic, item) {
  openTaskModal({
    title: "Edit Task",
    saveLabel: "Apply",
    currentText: { text: item.text, priority: item.priority, blocked: item.blocked, blockedReason: item.blockedReason },
    currentNames: item.responsibles || [],
    currentFeatureName: item.featureName || "",
    featureProjectKey: topic.projectKey || "",
    currentStatus: deriveTaskStatus(item, topic),
    onDelete: () => {
      topic.items = topic.items.filter((x) => x.id !== item.id);
      persistState();
      render();
    },
    onSave: ({ text, responsibles, priority, blocked, blockedReason, featureName, status }) => {
      item.text = text;
      item.responsibles = responsibles;
      item.priority = priority;
      item.done = status === "done";
      item.blocked = status === "blocked";
      item.blockedReason = item.blocked ? blockedReason : "";
      item.featureName = String(featureName || "").trim();
      item.projectKey = topic.projectKey;
      if (status === "doing") topic.status = "Desenvolvimento";
      else if (status === "testing") topic.status = "Teste";
      persistState();
      render();
    },
  });
}

function collectProjectDeliveryItems({ projectFilter = selectedProjectKey } = {}) {
  const map = new Map();
  state.sprints.forEach((sprint) => {
    sprint.topics.forEach((topic) => {
      normalizeTopic(topic);
      const projectKey = normalizeProjectKey(topic.projectKey);
      if (!projectKey) return;
      if (projectFilter && projectKey !== projectFilter) return;

      topic.items.forEach((item) => {
        if (!taskPassesBoardFilters(item, topic, sprint)) return;
        const project = map.get(projectKey) || {
          projectKey,
          title: projectLabel(projectKey),
          status: getProjectCurrentStatus(projectKey),
          sprints: new Map(),
          tasks: [],
        };
        project.status = getProjectCurrentStatus(projectKey);
        const task = { sprint, topic, item };
        project.tasks.push(task);
        const sprintGroup = project.sprints.get(sprint.id) || { sprint, tasks: [] };
        sprintGroup.tasks.push(task);
        project.sprints.set(sprint.id, sprintGroup);
        map.set(projectKey, project);
      });
    });
  });
  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
}

function renderProjectTaskboard() {
  el.boardTitle.textContent = "Project Taskboard";
  el.boardMeta.textContent = "All projects grouped by current project status.";
  const columns = PROJECT_STATUS_OPTIONS.map((status) => ({ id: status, title: status, projects: [] }));
  const columnMap = Object.fromEntries(columns.map((column) => [column.id, column]));

  collectProjectFeatureSummaries({ projectFilter: "", statusFilter: selectedProjectStatus }).forEach((project) => {
    if (!project.status) return;
    columnMap[project.status]?.projects.push(project);
  });

  el.topicsGrid.innerHTML = "";
  el.topicsGrid.classList.remove("delivery-grid");
  el.topicsGrid.classList.add("taskboard-grid", "project-taskboard-grid");

  const totalProjects = columns.reduce((total, column) => total + column.projects.length, 0);
  if (!totalProjects) {
    const msg = document.createElement("p");
    msg.className = "muted";
    msg.textContent = "No projects found with the current filters.";
    el.topicsGrid.appendChild(msg);
    return;
  }

  columns.forEach((column) => {
    const section = document.createElement("section");
    section.className = `taskboard-column taskboard-column-${column.id || "none"}`;
    section.innerHTML = `
      <div class="taskboard-column-head">
        <h4></h4>
        <span class="taskboard-count"></span>
      </div>
      <div class="taskboard-list"></div>
    `;
    section.querySelector("h4").textContent = column.title;
    section.querySelector(".taskboard-count").textContent = column.projects.length;
    const list = section.querySelector(".taskboard-list");

    list.addEventListener("dragover", (e) => {
      if (!dragProjectKey) return;
      e.preventDefault();
      list.classList.add("drop-active");
    });
    list.addEventListener("dragleave", (e) => {
      if (e.relatedTarget && list.contains(e.relatedTarget)) return;
      list.classList.remove("drop-active");
    });
    list.addEventListener("drop", (e) => {
      e.preventDefault();
      list.classList.remove("drop-active");
      const projectKey = normalizeProjectKey(dragProjectKey);
      dragProjectKey = "";
      if (!projectKey) return;
      projectControls[projectKey] = normalizeProjectControl(projectKey, { name: projectKey, status: column.id });
      saveProjectControl(projectKey, { status: column.id }).catch(() => {});
      render();
    });

    if (!column.projects.length) {
      const empty = document.createElement("div");
      empty.className = "item-empty-hint";
      empty.textContent = "No projects";
      list.appendChild(empty);
    }

    column.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "taskboard-task project-taskboard-card";
      card.draggable = true;
      card.innerHTML = `
        <div class="taskboard-task-head">
          <span class="taskboard-project"></span>
          <span class="taskboard-count"></span>
        </div>
        <p class="project-taskboard-desc muted"></p>
        <ul class="items-list project-taskboard-features"></ul>
      `;
      card.querySelector(".taskboard-project").textContent = project.title;
      card.querySelector(".taskboard-count").textContent = `${project.features.size} feature${project.features.size === 1 ? "" : "s"}`;
      card.querySelector(".project-taskboard-desc").textContent = project.description || "No description";
      appendProjectFeatureItems(card.querySelector(".project-taskboard-features"), project);
      card.addEventListener("dragstart", (e) => {
        dragProjectKey = project.projectKey;
        card.classList.add("dragging");
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", project.projectKey);
        }
      });
      card.addEventListener("dragend", () => {
        dragProjectKey = "";
        card.classList.remove("dragging");
        document.querySelectorAll(".taskboard-list.drop-active").forEach((x) => x.classList.remove("drop-active"));
      });
      list.appendChild(card);
    });

    el.topicsGrid.appendChild(section);
  });
}

function renderTaskboard() {
  const activeSprint = getActiveSprint();
  if (!activeSprint) {
    el.boardTitle.textContent = "No sprints yet";
    el.boardMeta.textContent = "Create your first sprint.";
    el.topicsGrid.innerHTML = "";
    el.topicsGrid.classList.remove("taskboard-grid", "project-taskboard-grid", "delivery-grid");
    return;
  }

  if (boardView === "projects") {
    renderProjectTaskboard();
    return;
  }

  if (boardView === "projects") {
    el.boardTitle.textContent = "Project";
    el.boardMeta.textContent = selectedProjectKey
      ? `Project: ${selectedProjectKey}`
      : "Showing tasks across every sprint.";
  } else {
    el.boardTitle.textContent = `Sprint ${activeSprint.name}`;
    el.boardMeta.textContent = activeSprint.goal || "No sprint goal defined.";
  }

  const columns = [
    { id: "blocked", title: "Blocked", items: [] },
    { id: "open", title: "Open", items: [] },
    { id: "doing", title: "Doing", items: [] },
    { id: "testing", title: "Testing", items: [] },
    { id: "done", title: "Done", items: [] },
  ];
  const columnMap = Object.fromEntries(columns.map((column) => [column.id, column]));
  const multiSprintMode = boardView === "projects";

  visibleSprints().forEach((sprint) => {
    sprint.topics.forEach((topic) => {
      normalizeTopic(topic);
      if (boardView === "projects" && selectedProjectKey && topic.projectKey !== selectedProjectKey) return;
      if (selectedProjectStatus && topic.status !== selectedProjectStatus) return;

      topic.items.forEach((item) => {
        if (!taskPassesBoardFilters(item, topic, sprint)) return;
        let columnId = "open";
        if (item.done) columnId = "done";
        else if (item.blocked) columnId = "blocked";
        else if (topic.status === "Desenvolvimento") columnId = "doing";
        else if (topic.status === "Teste") columnId = "testing";
        columnMap[columnId].items.push({ sprint, topic, item });
      });
    });
  });

  el.topicsGrid.innerHTML = "";
  el.topicsGrid.classList.remove("delivery-grid", "project-taskboard-grid");
  el.topicsGrid.classList.add("taskboard-grid");

  const totalTasks = columns.reduce((total, column) => total + column.items.length, 0);
  if (!totalTasks) {
    const msg = document.createElement("p");
    msg.className = "muted";
    msg.textContent = taskSearchText
      ? `No tasks found for "${taskSearchText}".`
      : "No tasks found with the current filters.";
    el.topicsGrid.appendChild(msg);
    return;
  }

  columns.forEach((column) => {
    const section = document.createElement("section");
    section.className = `taskboard-column taskboard-column-${column.id}`;
    section.innerHTML = `
      <div class="taskboard-column-head">
        <h4></h4>
        <span class="taskboard-count"></span>
      </div>
      <div class="taskboard-list"></div>
    `;
    section.querySelector("h4").textContent = column.title;
    section.querySelector(".taskboard-count").textContent = column.items.length;
    const list = section.querySelector(".taskboard-list");

    list.addEventListener("dragover", (e) => {
      if (!dragTaskState) return;
      e.preventDefault();
      list.classList.add("drop-active");
    });
    list.addEventListener("dragleave", (e) => {
      if (e.relatedTarget && list.contains(e.relatedTarget)) return;
      list.classList.remove("drop-active");
    });
    list.addEventListener("drop", (e) => {
      e.preventDefault();
      list.classList.remove("drop-active");
      moveDraggedTaskToTaskboardColumn(column.id);
      endTaskDrag();
    });

    if (!column.items.length) {
      const empty = document.createElement("div");
      empty.className = "item-empty-hint";
      empty.textContent = "No tasks";
      list.appendChild(empty);
    }

    column.items.forEach(({ sprint, topic, item }) => {
      const card = document.createElement("article");
      card.className = `taskboard-task ${item.done ? "done" : ""} ${item.priority === "high" ? "item-high" : ""} ${item.blocked ? "item-blocked" : ""}`;
      card.draggable = true;
      card.innerHTML = `
        <div class="taskboard-task-head">
          <span class="taskboard-project"></span>
          <button type="button" class="btn-link btn-link-neutral taskboard-edit" aria-label="Edit task" title="Edit task">✎</button>
        </div>
        <label class="taskboard-task-line">
          <input type="checkbox" ${item.followed ? "checked" : ""} title="Followed this week" aria-label="Followed this week" />
          <span class="taskboard-task-text"></span>
        </label>
        <div class="taskboard-tags"></div>
      `;
      const projectText = projectLabel(topic.projectKey) || topic.title || "No project";
      card.querySelector(".taskboard-project").textContent = multiSprintMode
        ? `${projectText} | Sprint ${sprint.name}`
        : projectText;
      card.querySelector(".taskboard-task-text").textContent = itemDisplayText(item);

      const tags = card.querySelector(".taskboard-tags");
      if (item.featureName) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = item.featureName;
        tags.appendChild(tag);
      }
      if (item.priority === "high") {
        const tag = document.createElement("span");
        tag.className = "tag tag-high";
        tag.textContent = "HIGH";
        tags.appendChild(tag);
      }
      if (item.blocked) {
        const tag = document.createElement("span");
        tag.className = "tag tag-blocked";
        tag.textContent = "BLOCKED";
        tags.appendChild(tag);
      }
      if (item.blocked && item.blockedReason) {
        const reason = document.createElement("div");
        reason.className = "item-blocked-reason";
        reason.textContent = `Reason: ${item.blockedReason}`;
        tags.appendChild(reason);
      }

      card.querySelector("input").addEventListener("change", (e) => {
        item.followed = e.target.checked;
        persistState();
        render();
      });
      card.addEventListener("dragstart", (e) => {
        beginTopicTaskDrag(topic.id, item.id);
        card.classList.add("dragging");
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", item.id);
        }
      });
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        document.querySelectorAll(".taskboard-list.drop-active").forEach((x) => x.classList.remove("drop-active"));
        endTaskDrag();
      });
      card.querySelector(".taskboard-edit").addEventListener("click", () => {
        openTopicTaskEditor(topic, item);
      });
      list.appendChild(card);
    });

    el.topicsGrid.appendChild(section);
  });
}

function moveDraggedTaskToTaskboardColumn(columnId) {
  if (!dragTaskState || dragTaskState.sourceType !== "topic") return false;
  const sprint = getActiveSprint();
  if (!sprint) return false;
  const topic = sprint.topics.find((t) => t.id === dragTaskState.topicId);
  if (!topic) return false;
  const item = topic.items.find((i) => i.id === dragTaskState.itemId);
  if (!item) return false;

  if (columnId === "done") {
    item.done = true;
    item.blocked = false;
    item.blockedReason = "";
  } else if (columnId === "blocked") {
    item.done = false;
    item.blocked = true;
  } else {
    item.done = false;
    item.blocked = false;
    item.blockedReason = "";
    if (columnId === "doing") topic.status = "Desenvolvimento";
    else if (columnId === "testing") topic.status = "Teste";
  }

  persistState();
  render();
  return true;
}

function renderDeliveryView() {
  el.boardTitle.textContent = "Delivery";
  el.boardMeta.textContent = selectedProjectKey
    ? `Delivery plan for ${selectedProjectKey} across sprints.`
    : "Delivery plan across sprints and projects.";
  el.topicsGrid.innerHTML = "";
  el.topicsGrid.classList.remove("taskboard-grid", "project-taskboard-grid");
  el.topicsGrid.classList.add("delivery-grid");

  const hasDeliverySprintRange = Boolean(deliveryStartSprintId || deliveryEndSprintId);
  const allSprints = hasDeliverySprintRange ? getDeliverySprintRange([...state.sprints]) : [...state.sprints];
  const projects = new Map();
  const usedSprintIds = new Set();

  allSprints.forEach((sprint) => {
    sprint.topics.forEach((topic) => {
      normalizeTopic(topic);
      const projectKey = normalizeProjectKey(topic.projectKey);
      if (!projectKey) return;
      if (selectedProjectKey && projectKey !== selectedProjectKey) return;
      const projectStatus = getProjectCurrentStatus(projectKey);
      if (selectedProjectStatus && projectStatus !== selectedProjectStatus) return;

      const visibleItems = topic.items.filter((item) => taskMatchesSearch(item, topic, sprint));
      if (!visibleItems.length) return;

      const project = projects.get(projectKey) || {
        projectKey,
        title: projectLabel(projectKey),
        status: projectStatus,
        sprints: new Map(),
      };
      const sprintGroup = project.sprints.get(sprint.id) || { sprint, tasks: [] };
      visibleItems.forEach((item) => sprintGroup.tasks.push({ topic, item }));
      project.sprints.set(sprint.id, sprintGroup);
      usedSprintIds.add(sprint.id);
      projects.set(projectKey, project);
    });
  });

  const firstUsedIndex = allSprints.findIndex((sprint) => usedSprintIds.has(sprint.id));
  const sprints = hasDeliverySprintRange
    ? allSprints
    : (firstUsedIndex >= 0 ? allSprints.slice(firstUsedIndex) : allSprints);
  const sprintIndex = new Map(sprints.map((sprint, index) => [sprint.id, index]));
  const visibleProjects = Array.from(projects.values()).sort((a, b) => a.title.localeCompare(b.title));
  if (!sprints.length || !visibleProjects.length) {
    const msg = document.createElement("p");
    msg.className = "muted";
    msg.textContent = "No delivery items found with the current filters.";
    el.topicsGrid.appendChild(msg);
    return;
  }

  if (selectedProjectKey && visibleProjects.length === 1) {
    const project = visibleProjects[0];
    const detail = document.createElement("section");
    detail.className = "delivery-detail";
    detail.style.setProperty("--delivery-columns", String(sprints.length));
    detail.innerHTML = `
      <div class="delivery-plan-head"></div>
      <div class="delivery-detail-body"></div>
    `;
    const detailHead = detail.querySelector(".delivery-plan-head");
    sprints.forEach((sprint) => {
      const cell = document.createElement("div");
      cell.className = "delivery-period";
      cell.innerHTML = `
        <strong></strong>
        <span></span>
      `;
      cell.querySelector("strong").textContent = sprint.name;
      cell.querySelector("span").textContent = sprint.goal || "No sprint goal";
      detailHead.appendChild(cell);
    });

    const tasksByName = new Map();
    sprints.forEach((sprint) => {
      const tasks = project.sprints.get(sprint.id)?.tasks || [];
      tasks.forEach(({ topic, item }) => {
        const key = normalizeSearchText(item.text || itemDisplayText(item));
        if (!key) return;
        const group = tasksByName.get(key) || { label: itemDisplayText(item), sprints: new Map() };
        const sprintGroup = group.sprints.get(sprint.id) || { sprint, tasks: [] };
        sprintGroup.tasks.push({ topic, item });
        group.sprints.set(sprint.id, sprintGroup);
        tasksByName.set(key, group);
      });
    });

    const segments = [];
    Array.from(tasksByName.values())
      .sort((a, b) => a.label.localeCompare(b.label))
      .forEach((group) => {
        const activeIndexes = Array.from(group.sprints.keys())
          .map((id) => sprintIndex.get(id))
          .filter((index) => Number.isInteger(index))
          .sort((a, b) => a - b);
        if (!activeIndexes.length) return;

        const flushSegment = (start, end) => {
          const segmentSprints = sprints.slice(start, end + 1);
          const segmentTasks = segmentSprints.flatMap((sprint) => group.sprints.get(sprint.id)?.tasks || []);
          const doneCount = segmentTasks.filter(({ item }) => item.done).length;
          const totalCount = segmentTasks.length;
          const progress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
          segments.push({
            start,
            end,
            label: group.label,
            rangeLabel: start === end ? `Sprint ${sprints[start].name}` : `Sprint ${sprints[start].name} - ${sprints[end].name}`,
            doneCount,
            totalCount,
            progress,
            blocked: segmentTasks.some(({ item }) => item.blocked),
            high: segmentTasks.some(({ item }) => item.priority === "high"),
            groups: segmentSprints.map((sprint) => {
              const tasks = group.sprints.get(sprint.id)?.tasks || [];
              return {
                title: `Sprint ${sprint.name}`,
                meta: `${tasks.length} task${tasks.length === 1 ? "" : "s"}`,
                items: tasks.map(({ item }) => {
                  const parts = [];
                  if (item.responsibles?.length) parts.push(`Responsibles: ${item.responsibles.join(" + ")}`);
                  if (item.blocked && item.blockedReason) parts.push(`Blocked: ${item.blockedReason}`);
                  else if (item.blocked) parts.push("Blocked");
                  if (item.followed) parts.push("Followed this week");
                  if (item.done) parts.push("Done");
                  return parts.join(" | ") || "Tracked in this sprint";
                }),
              };
            }),
          });
        };

        let segmentStart = activeIndexes[0];
        let previous = activeIndexes[0];
        activeIndexes.slice(1).forEach((index) => {
          if (index === previous + 1) {
            previous = index;
            return;
          }
          flushSegment(segmentStart, previous);
          segmentStart = index;
          previous = index;
        });
        flushSegment(segmentStart, previous);
      });

    const rows = [];
    segments
      .sort((a, b) => a.start - b.start || a.end - b.end || a.label.localeCompare(b.label))
      .forEach((segment) => {
        let row = rows.find((candidate) => candidate.lastEnd < segment.start);
        if (!row) {
          row = { lastEnd: -1, segments: [] };
          rows.push(row);
        }
        row.segments.push(segment);
        row.lastEnd = segment.end;
      });

    const body = detail.querySelector(".delivery-detail-body");
    rows.forEach((row) => {
      const lane = document.createElement("div");
      lane.className = "delivery-lane delivery-detail-lane";
      lane.style.setProperty("--delivery-columns", String(sprints.length));

      for (let index = 0; index < sprints.length; index += 1) {
        const bg = document.createElement("div");
        bg.className = "delivery-lane-cell";
        bg.style.gridColumn = `${index + 1}`;
        lane.appendChild(bg);
      }

      row.segments.forEach((segment) => {
        const card = document.createElement("article");
          card.className = `delivery-detail-task delivery-status-${normalizeStatusClass(project.status)} ${segment.doneCount === segment.totalCount ? "done" : ""} ${segment.blocked ? "item-blocked" : ""}`;
        card.style.gridColumn = `${segment.start + 1} / ${segment.end + 2}`;
        card.innerHTML = `
          <strong></strong>
          <span></span>
          <div class="delivery-detail-task-tags"></div>
          <div class="delivery-progress"><span></span></div>
        `;
        card.querySelector("strong").textContent = segment.label;
        card.querySelector("span").textContent = segment.rangeLabel;
        const tags = card.querySelector(".delivery-detail-task-tags");
        if (segment.high) {
          const tag = document.createElement("span");
          tag.className = "tag tag-high";
          tag.textContent = "HIGH";
          tags.appendChild(tag);
        }
        if (segment.blocked) {
          const tag = document.createElement("span");
          tag.className = "tag tag-blocked";
          tag.textContent = "BLOCKED";
          tags.appendChild(tag);
        }
        if (segment.doneCount === segment.totalCount) {
          const tag = document.createElement("span");
          tag.className = "tag";
          tag.textContent = "DONE";
          tags.appendChild(tag);
        }
        const count = document.createElement("span");
        count.className = "tag";
        count.textContent = `${segment.doneCount}/${segment.totalCount}`;
        tags.appendChild(count);
        card.querySelector(".delivery-progress span").style.width = `${segment.progress}%`;
        card.addEventListener("click", () => {
          openDeliveryInfoModal({
            title: segment.label,
            subtitle: `${selectedProjectKey} | ${segment.rangeLabel}`,
            groups: segment.groups,
          });
        });
        lane.appendChild(card);
      });

      body.appendChild(lane);
    });

    el.topicsGrid.appendChild(detail);
    return;
  }

  const plan = document.createElement("section");
  plan.className = "delivery-plan";
  plan.style.setProperty("--delivery-columns", String(sprints.length));
  plan.innerHTML = `
    <div class="delivery-plan-head"></div>
    <div class="delivery-plan-body"></div>
  `;

  const head = plan.querySelector(".delivery-plan-head");
  sprints.forEach((sprint) => {
    const cell = document.createElement("div");
    cell.className = "delivery-period";
    cell.innerHTML = `
      <strong></strong>
      <span></span>
    `;
    cell.querySelector("strong").textContent = sprint.name;
    cell.querySelector("span").textContent = sprint.goal || "No sprint goal";
    head.appendChild(cell);
  });

  const projectSegments = [];
  visibleProjects.forEach((project) => {
    const activeIndexes = Array.from(project.sprints.keys())
      .map((id) => sprintIndex.get(id))
      .filter((index) => Number.isInteger(index))
      .sort((a, b) => a - b);
    if (!activeIndexes.length) return;

    const flushSegment = (start, end) => {
      const segmentSprints = sprints.slice(start, end + 1);
      const segmentTasks = segmentSprints.flatMap((sprint) => project.sprints.get(sprint.id)?.tasks || []);
      const doneCount = segmentTasks.filter(({ item }) => item.done).length;
      const totalCount = segmentTasks.length;
      const progress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
      projectSegments.push({
        start,
        end,
        project,
        rangeLabel: start === end ? `Sprint ${sprints[start].name}` : `Sprint ${sprints[start].name} - ${sprints[end].name}`,
        doneCount,
        totalCount,
        progress,
        segmentTasks,
        groups: segmentSprints.map((sprint) => {
          const tasks = project.sprints.get(sprint.id)?.tasks || [];
          return {
            title: `Sprint ${sprint.name}`,
            meta: `${tasks.length} task${tasks.length === 1 ? "" : "s"}`,
                items: tasks.map(({ topic, item }) => `${topic.title}: ${itemDisplayText(item)}`),
              };
            }),
          });
    };

    let segmentStart = activeIndexes[0];
    let previous = activeIndexes[0];
    activeIndexes.slice(1).forEach((index) => {
      if (index === previous + 1) {
        previous = index;
        return;
      }
      flushSegment(segmentStart, previous);
      segmentStart = index;
      previous = index;
    });
    flushSegment(segmentStart, previous);
  });

  const rows = [];
  projectSegments
    .sort((a, b) => a.start - b.start || a.end - b.end || a.project.title.localeCompare(b.project.title))
    .forEach((segment) => {
      let row = rows.find((candidate) => candidate.lastEnd < segment.start);
      if (!row) {
        row = { lastEnd: -1, segments: [] };
        rows.push(row);
      }
      row.segments.push(segment);
      row.lastEnd = segment.end;
    });

  const body = plan.querySelector(".delivery-plan-body");
  rows.forEach((row) => {
    const lane = document.createElement("div");
    lane.className = "delivery-lane";
    lane.style.setProperty("--delivery-columns", String(sprints.length));

    for (let index = 0; index < sprints.length; index += 1) {
      const bg = document.createElement("div");
      bg.className = "delivery-lane-cell";
      bg.style.gridColumn = `${index + 1}`;
      lane.appendChild(bg);
    }

    row.segments.forEach((segment) => {
      const { project } = segment;
      const card = document.createElement("article");
      card.className = `delivery-plan-card delivery-status-${normalizeStatusClass(project.status)}`;
      card.style.gridColumn = `${segment.start + 1} / ${segment.end + 2}`;
      card.innerHTML = `
        <div class="delivery-plan-card-head">
          <strong></strong>
          <span></span>
        </div>
        <div class="delivery-plan-meta">
          <span class="topic-status-tag hidden"></span>
          <span class="delivery-plan-count"></span>
        </div>
        <ul class="delivery-plan-tasks"></ul>
        <div class="delivery-progress"><span></span></div>
      `;
      card.querySelector(".delivery-plan-card-head strong").textContent = project.title;
      card.querySelector(".delivery-plan-card-head span").textContent = segment.rangeLabel;
      const statusTag = card.querySelector(".topic-status-tag");
      if (project.status) {
        statusTag.textContent = project.status;
        statusTag.dataset.status = project.status;
        statusTag.classList.remove("hidden");
      }
      card.querySelector(".delivery-plan-count").textContent = `${segment.doneCount}/${segment.totalCount} done`;
      const taskList = card.querySelector(".delivery-plan-tasks");
      segment.segmentTasks.slice(0, 4).forEach(({ topic, item }) => {
        const li = document.createElement("li");
        li.className = item.done ? "done" : "";
        li.textContent = `${topic.title}: ${itemDisplayText(item)}`;
        taskList.appendChild(li);
      });
      if (segment.segmentTasks.length > 4) {
        const li = document.createElement("li");
        li.className = "muted";
        li.textContent = `+${segment.segmentTasks.length - 4} more`;
        taskList.appendChild(li);
      }
      card.querySelector(".delivery-progress span").style.width = `${segment.progress}%`;
      card.addEventListener("click", () => {
        openDeliveryInfoModal({
          title: project.title,
          subtitle: segment.rangeLabel,
          groups: segment.groups,
        });
      });
      lane.appendChild(card);
    });

    body.appendChild(lane);
  });

  el.topicsGrid.appendChild(plan);
}

function renderProjectFeatureCards() {
  el.boardTitle.textContent = "Project";
  el.boardMeta.textContent = selectedProjectKey
    ? `Project: ${selectedProjectKey}`
    : "Showing projects and their features.";
  el.topicsGrid.innerHTML = "";

  const entries = collectProjectFeatureSummaries();
  if (!entries.length) {
    const msg = document.createElement("p");
    msg.className = "muted";
    msg.textContent = taskSearchText
      ? `No projects found for "${taskSearchText}".`
      : "No projects found with the current filters.";
    el.topicsGrid.appendChild(msg);
    return;
  }

  entries.forEach((project) => {
    const node = el.topicTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".topic-title").textContent = project.title;
    node.querySelector(".topic-project").textContent = `${project.features.size} feature${project.features.size === 1 ? "" : "s"}`;
    const statusTag = node.querySelector(".topic-status-tag");
    if (project.status) {
      statusTag.textContent = project.status;
      statusTag.dataset.status = project.status;
      statusTag.classList.remove("hidden");
    } else {
      statusTag.textContent = "";
      delete statusTag.dataset.status;
      statusTag.classList.add("hidden");
    }
    node.querySelector(".topic-desc").textContent = project.description || "No description";
    node.querySelector(".topic-edit-btn").addEventListener("click", () => {
      const sprint = project.latestSprint;
      const topic = project.latestTopic;
      if (!sprint || !topic) return;
      openProjectModal(
        topic,
        sprint.id,
        ({ title, description, projectKey, status }) => {
          topic.title = title;
          topic.description = description;
          topic.projectKey = normalizeProjectKey(projectKey);
          topic.status = normalizeProjectStatus(status);
          topic.items.forEach((item) => {
            normalizeItem(item);
            item.projectKey = topic.projectKey;
          });
          if (topic.projectKey) {
            projectControls[topic.projectKey] = normalizeProjectControl(topic.projectKey, {
              name: topic.projectKey,
              status: topic.status,
            });
            saveProjectControl(topic.projectKey, { status: topic.status }).catch(() => {});
          }
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
          targetSprint.topics.push({
            id: uid(),
            title: topic.title,
            projectKey: topic.projectKey || "",
            status: normalizeProjectStatus(topic.status),
            description: topic.description,
            items: itemsToCopy.map((item) => ({
              id: uid(),
              text: item.text,
              done: item.done,
              projectKey: topic.projectKey || "",
              followed: Boolean(item.followed),
              responsibles: [...(item.responsibles || [])],
              priority: item.priority === "high" ? "high" : "normal",
              blocked: Boolean(item.blocked),
              blockedReason: String(item.blockedReason || "").trim(),
              featureName: String(item.featureName || "").trim(),
            })),
          });
          persistState();
          render();
        },
        async (projectKey) => {
          await openTimelineModal(projectKey || topic.projectKey);
        }
      );
    });

    const addItemBtn = node.querySelector(".add-item-btn");
    addItemBtn.classList.add("hidden");
    const itemsList = node.querySelector(".items-list");
    itemsList.innerHTML = "";
    appendProjectFeatureItems(itemsList, project);

    el.topicsGrid.appendChild(node);
  });
}

function renderTopics() {
  const activeSprint = getActiveSprint();
  if (!activeSprint) {
    el.boardTitle.textContent = "No sprints yet";
    el.boardMeta.textContent = "Create your first sprint.";
    el.topicsGrid.innerHTML = "";
    return;
  }
  el.topicsGrid.classList.remove("taskboard-grid");
  el.topicsGrid.classList.remove("project-taskboard-grid", "delivery-grid");

  if (boardView === "projects") {
    el.boardTitle.textContent = "Project";
    el.boardMeta.textContent = selectedProjectKey
      ? `Project: ${selectedProjectKey}`
      : "Showing activities across every sprint.";
  } else {
    el.boardTitle.textContent = `Sprint ${activeSprint.name}`;
    el.boardMeta.textContent = activeSprint.goal || "No sprint goal defined.";
  }
  if (boardView === "projects") {
    renderProjectFeatureCards();
    return;
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
      if (selectedProjectStatus && topic.status !== selectedProjectStatus) return;

      const visibleItems = topic.items.filter((item) => {
        return taskPassesBoardFilters(item, topic, sprint);
      });
      if ((taskSearchText || selectedResponsible || filterHighOnly || filterBlockedOnly) && visibleItems.length === 0) return;

      const node = el.topicTemplate.content.firstElementChild.cloneNode(true);
      node.querySelector(".topic-title").textContent = topic.title;
      const projectText = projectLabel(topic.projectKey);
      node.querySelector(".topic-project").textContent = multiSprintMode
        ? `${projectText} | Sprint ${sprint.name}`
        : projectText;
      const statusTag = node.querySelector(".topic-status-tag");
      if (topic.status) {
        statusTag.textContent = topic.status;
        statusTag.dataset.status = topic.status;
        statusTag.classList.remove("hidden");
      } else {
        statusTag.textContent = "";
        delete statusTag.dataset.status;
        statusTag.classList.add("hidden");
      }
      node.querySelector(".topic-desc").textContent = topic.description || "No description";
      node.querySelector(".topic-edit-btn").addEventListener("click", () => {
        openProjectModal(
          topic,
          sprint.id,
          ({ title, description, projectKey, status }) => {
            topic.title = title;
            topic.description = description;
            topic.projectKey = normalizeProjectKey(projectKey);
            topic.status = normalizeProjectStatus(status);
            topic.items.forEach((item) => {
              normalizeItem(item);
              item.projectKey = topic.projectKey;
            });
            if (topic.projectKey) {
              projectControls[topic.projectKey] = normalizeProjectControl(topic.projectKey, {
                name: topic.projectKey,
                status: topic.status,
              });
              saveProjectControl(topic.projectKey, { status: topic.status }).catch(() => {});
            }
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
              status: normalizeProjectStatus(topic.status),
              description: topic.description,
              items: itemsToCopy.map((item) => ({
                id: uid(),
                text: item.text,
                done: item.done,
                projectKey: topic.projectKey || "",
                followed: Boolean(item.followed),
                responsibles: [...(item.responsibles || [])],
                priority: item.priority === "high" ? "high" : "normal",
                blocked: Boolean(item.blocked),
                blockedReason: String(item.blockedReason || "").trim(),
                featureName: String(item.featureName || "").trim(),
              })),
            };

            targetSprint.topics.push(cloned);
            persistState();
            render();
          },
          async (projectKey) => {
            await openTimelineModal(projectKey || topic.projectKey);
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
          moveDraggedTaskToTopic(topic.id, null);
          endTaskDrag();
        });
      }

      visibleItems.forEach((item) => {
        const li = document.createElement("li");
        li.className = `item ${item.done ? "done" : ""} ${item.priority === "high" ? "item-high" : ""} ${item.blocked ? "item-blocked" : ""}`;
        li.draggable = canDrag;
        normalizeItem(item);
        li.innerHTML = `
          <input type="checkbox" ${item.followed ? "checked" : ""} title="Followed this week" aria-label="Followed this week" />
          <span class="item-line"><span class="item-text"></span></span>
          <div>
            <button type="button" class="btn-link btn-link-neutral item-edit" aria-label="Edit task" title="Edit task">✎</button>
          </div>
        `;
        li.querySelector(".item-text").textContent = itemDisplayText(item);
        const itemLine = li.querySelector(".item-line");
        if (item.featureName) {
          const tag = document.createElement("span");
          tag.className = "tag";
          tag.textContent = item.featureName;
          itemLine.appendChild(tag);
        }
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
        if (item.blocked && item.blockedReason) {
          const reason = document.createElement("div");
          reason.className = "item-blocked-reason";
          reason.textContent = `Reason: ${item.blockedReason}`;
          itemLine.appendChild(reason);
        }

        if (canDrag) {
          li.addEventListener("dragstart", (e) => {
            beginTopicTaskDrag(topic.id, item.id);
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
            moveDraggedTaskToTopic(topic.id, item.id);
            endTaskDrag();
          });
        }

        li.querySelector("input").addEventListener("change", (e) => {
          item.followed = e.target.checked;
          persistState();
          render();
        });

        li.querySelector(".item-text").addEventListener("click", () => {
          item.followed = !item.followed;
          persistState();
          render();
        });

        li.querySelector(".item-edit").addEventListener("click", () => {
          openTopicTaskEditor(topic, item);
        });

        itemsList.appendChild(li);
      });

      const addItemBtn = node.querySelector(".add-item-btn");
      addItemBtn.addEventListener("click", () => {
        openTaskModal({
          title: "New Task",
          saveLabel: "Create",
          currentText: { text: "", priority: "normal", blocked: false, blockedReason: "" },
          currentNames: [],
          featureProjectKey: topic.projectKey || "",
          currentStatus: deriveTaskStatus({}, topic),
          onSave: ({ text, responsibles, priority, blocked, blockedReason, featureName, status }) => {
            topic.items.push({
              id: uid(),
              text,
              done: status === "done",
              projectKey: normalizeProjectKey(topic.projectKey),
              responsibles,
              priority,
              blocked: status === "blocked",
              blockedReason: status === "blocked" ? blockedReason : "",
              featureName: String(featureName || "").trim(),
            });
            if (status === "doing") topic.status = "Desenvolvimento";
            else if (status === "testing") topic.status = "Teste";
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
    if (taskSearchText) {
      msg.textContent = `No tasks found for "${taskSearchText}".`;
    } else if (selectedResponsible) {
      msg.textContent = `No tasks found for ${selectedResponsible} in this view.`;
    } else if (filterHighOnly || filterBlockedOnly) {
      msg.textContent = "No tasks found with the current task filters.";
    } else if (selectedProjectStatus) {
      msg.textContent = `No projects found with status ${selectedProjectStatus}.`;
    } else {
      msg.textContent = "No projects found with the current filters.";
    }
    el.topicsGrid.appendChild(msg);
  }
}

function render() {
  if (boardView === "projects" && selectedProjectKey && !projectCatalog.includes(selectedProjectKey)) {
    selectedProjectKey = "";
  }
  if (el.leftPanelSearch) el.leftPanelSearch.value = projectSearchText;
  el.taskSearchInput.value = taskSearchText;
  renderLeftPanel();
  renderTopicProjectSelect();
  renderTopicStatusSelect(el.topicStatusSelect?.value || "");
  renderResponsibleFilter();
  renderProjectStatusFilter();
  renderTaskFilterVisibility();
  renderBoardSprintSelect();
  renderDeliverySprintRangeSelects();
  renderBoardProjectSelect();
  renderBacklogProjectFilter();
  if (taskLayoutView === "taskboard") renderTaskboard();
  else if (taskLayoutView === "delivery") renderDeliveryView();
  else renderTopics();
  renderBacklog();
  const projectsMode = boardView === "projects";
  const deliveryMode = taskLayoutView === "delivery";
  el.topicsGrid.closest(".workspace")?.classList.toggle("workspace-delivery", deliveryMode);
  el.newSprintBtn.classList.toggle("hidden", projectsMode);
  el.newTopicBtn.disabled = projectsMode;
  el.editSprintBtn.disabled = projectsMode;
  el.taskboardViewBtn.textContent = taskLayoutView === "taskboard" ? "Project Cards" : "Taskboard";
  el.taskboardViewBtn.classList.toggle("active", taskLayoutView === "taskboard");
  el.deliveryViewBtn.classList.toggle("hidden", !projectsMode);
  el.deliveryViewBtn.classList.toggle("active", taskLayoutView === "delivery");
  el.backlogList.closest(".backlog-panel")?.classList.toggle("hidden", deliveryMode);
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
    status: normalizeProjectStatus(topic.status),
    description: topic.description,
    items: topic.items.map((item) => ({
      id: uid(),
      text: item.text,
      done: includeDone ? item.done : false,
      followed: Boolean(item.followed),
      responsibles: [...(item.responsibles || [])],
      priority: item.priority === "high" ? "high" : "normal",
      blocked: Boolean(item.blocked),
      blockedReason: String(item.blockedReason || "").trim(),
      featureName: String(item.featureName || "").trim(),
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
  const status = normalizeProjectStatus(el.topicStatusSelect.value);
  const description = el.topicDescInput.value.trim();
  if (!title) return;

  sprint.topics.push({ id: uid(), title, projectKey, status, description, items: [] });
  el.topicTitleInput.value = "";
  el.topicProjectSelect.value = "";
  el.topicStatusSelect.value = "";
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
      backlog: (payload.backlog || []).map((item) => normalizeBacklogItem(item)),
    };
    await refreshProjectCatalog();
    try {
      await loadTeamMembersFromFiles();
    } catch {
      // Keep fallback team list if endpoint fails.
    }
    normalizeAllTopics();
    normalizeAllBacklog();
    dataMode = "files";
    setStatus("file-based (`tech/sprints/*.md`)");
  } catch (err) {
    state = loadStateLocal();
    normalizeAllTopics();
    normalizeAllBacklog();
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
    },
    async () => {
      try {
        await copyActiveSprintMarkdown();
      } catch (err) {
        window.alert(`Failed to copy sprint markdown: ${err.message}`);
      }
    },
    async () => {
      try {
        await sendActiveSprintMarkdownToTeams();
      } catch (err) {
        window.alert(`Failed to send sprint markdown to Teams: ${err.message}`);
      }
    }
  );
});
el.pjsBtn.addEventListener("click", openPjsModal);
el.projectsBtn.addEventListener("click", openProjectsModal);
el.taskboardViewBtn.addEventListener("click", () => {
  taskLayoutView = taskLayoutView === "taskboard" ? "projects" : "taskboard";
  render();
});
el.deliveryViewBtn.addEventListener("click", () => {
  boardView = "projects";
  taskLayoutView = taskLayoutView === "delivery" ? "projects" : "delivery";
  render();
});
el.viewModeBtn.addEventListener("click", () => {
  if (boardView === "projects") {
    boardView = "sprints";
    projectSearchText = "";
    selectedProjectKey = "";
    if (taskLayoutView === "delivery") taskLayoutView = "projects";
  } else {
    boardView = "projects";
    selectedProjectKey = "";
  }
  render();
});
if (el.leftPanelSearch) {
  el.leftPanelSearch.addEventListener("input", () => {
    projectSearchText = el.leftPanelSearch.value || "";
    render();
  });
}
if (el.boardSprintSelect) {
  el.boardSprintSelect.addEventListener("change", () => {
    state.activeSprintId = el.boardSprintSelect.value || state.activeSprintId;
    render();
  });
}
if (el.deliveryStartSprintSelect) {
  el.deliveryStartSprintSelect.addEventListener("change", () => {
    deliveryStartSprintId = el.deliveryStartSprintSelect.value || "";
    render();
  });
}
if (el.deliveryEndSprintSelect) {
  el.deliveryEndSprintSelect.addEventListener("change", () => {
    deliveryEndSprintId = el.deliveryEndSprintSelect.value || "";
    render();
  });
}
if (el.boardProjectSelect) {
  el.boardProjectSelect.addEventListener("change", () => {
    selectedProjectKey = normalizeProjectKey(el.boardProjectSelect.value);
    render();
  });
}
el.taskSearchInput.addEventListener("input", () => {
  taskSearchText = el.taskSearchInput.value || "";
  render();
});
el.responsibleFilter.addEventListener("change", () => {
  selectedResponsible = el.responsibleFilter.value || "";
  render();
});
el.projectStatusFilter.addEventListener("change", () => {
  selectedProjectStatus = normalizeProjectStatus(el.projectStatusFilter.value);
  render();
});
el.backlogProjectFilter.addEventListener("change", () => {
  selectedBacklogProject = normalizeProjectKey(el.backlogProjectFilter.value);
  render();
});
el.newBacklogItemBtn.addEventListener("click", () => {
    openTaskModal({
      title: "New Backlog Task",
      subtitle: "Create a backlog task with task text and project.",
      saveLabel: "Create",
      currentText: { text: "", priority: "normal", blocked: false, blockedReason: "" },
      currentNames: [],
      currentProjectKey: selectedBacklogProject || "",
      backlogMode: true,
      onSave: ({ text, projectKey, featureName }) => {
        state.backlog.push(
          normalizeBacklogItem({
            id: uid(),
            text,
            done: false,
            projectKey: normalizeProjectKey(projectKey),
            featureName: String(featureName || "").trim(),
          })
        );
      persistState();
      render();
    },
  });
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
el.modalDeleteBtn.addEventListener("click", () => {
  if (!itemEditModalOnDelete) return;
  if (!window.confirm("Remove this task?")) return;
  itemEditModalOnDelete();
  closeAssigneeModal();
});
el.modalTaskStatusSelect.addEventListener("change", () => {
  if (taskModalBacklogMode) return;
  const status = el.modalTaskStatusSelect.value || "open";
  const enabled = status === "blocked";
  el.modalBlockedReasonInput.disabled = !enabled;
  el.modalBlockedReasonInput.classList.toggle("hidden", !enabled);
  if (!enabled) el.modalBlockedReasonInput.value = "";
});
el.modalBacklogProjectSelect.addEventListener("change", () => {
  if (!taskModalBacklogMode) return;
  renderTaskModalFeatureSelect(el.modalBacklogProjectSelect.value, "");
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
    projectKey: taskModalBacklogMode ? normalizeProjectKey(el.modalBacklogProjectSelect.value) : "",
    featureName: String(el.modalFeatureSelect?.value || "").trim(),
    status: taskModalBacklogMode ? "open" : (el.modalTaskStatusSelect.value || "open"),
    responsibles: taskModalBacklogMode ? [] : selected,
    priority: taskModalBacklogMode ? "normal" : (el.modalHighPriorityCheck.checked ? "high" : "normal"),
    blocked: taskModalBacklogMode ? false : ((el.modalTaskStatusSelect.value || "open") === "blocked"),
    blockedReason: taskModalBacklogMode ? "" : (((el.modalTaskStatusSelect.value || "open") === "blocked") ? el.modalBlockedReasonInput.value.trim() : ""),
  });
  closeAssigneeModal();
});
el.projectCancelBtn.addEventListener("click", closeProjectModal);
el.projectKeySelect.addEventListener("change", () => {
  el.projectDeliveryBtn.disabled = !normalizeProjectKey(el.projectKeySelect.value);
  el.projectFeaturesBtn.disabled = !normalizeProjectKey(el.projectKeySelect.value);
  el.projectTimelineBtn.disabled = !normalizeProjectKey(el.projectKeySelect.value) || !projectModalOnTimeline;
});
el.projectDeliveryBtn.addEventListener("click", () => {
  const projectKey = normalizeProjectKey(el.projectKeySelect.value);
  if (!projectKey) {
    window.alert("Select a project folder first.");
    return;
  }
  boardView = "projects";
  taskLayoutView = "delivery";
  selectedProjectKey = projectKey;
  closeProjectModal();
  render();
});
el.projectSaveBtn.addEventListener("click", () => {
  if (!projectModalOnSave) {
    closeProjectModal();
    return;
  }
  const title = el.projectTitleInput.value.trim();
  const projectKey = normalizeProjectKey(el.projectKeySelect.value);
  const status = normalizeProjectStatus(el.projectStatusSelect.value);
  const description = el.projectDescInput.value.trim();
  if (!title) {
    window.alert("Project title cannot be empty.");
    return;
  }
  projectModalOnSave({ title, description, projectKey, status });
  closeProjectModal();
});
el.projectTimelineBtn.addEventListener("click", async () => {
  if (!projectModalOnTimeline) return;
  const selectedProjectKey = normalizeProjectKey(el.projectKeySelect.value);
  if (!selectedProjectKey) {
    window.alert("Select a project folder first.");
    return;
  }
  try {
    await projectModalOnTimeline(selectedProjectKey);
    closeProjectModal();
  } catch (err) {
    window.alert(`Failed to open timeline: ${err.message}`);
  }
});
el.projectFeaturesBtn.addEventListener("click", async () => {
  const selectedProjectKey = normalizeProjectKey(el.projectKeySelect.value);
  if (!selectedProjectKey) {
    window.alert("Select a project folder first.");
    return;
  }
  try {
    await openFeaturesModal(selectedProjectKey);
    closeProjectModal();
  } catch (err) {
    window.alert(`Failed to open features: ${err.message}`);
  }
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
el.copyTargetCancelBtn.addEventListener("click", closeCopyTargetModal);
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
el.sprintCopyMdBtn.addEventListener("click", async () => {
  if (!sprintModalOnCopyMd) return;
  await sprintModalOnCopyMd();
});
el.sprintSendTeamsBtn.addEventListener("click", async () => {
  if (!sprintModalOnSendTeams) return;
  await sprintModalOnSendTeams();
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
el.timelineCloseBtn.addEventListener("click", closeTimelineModal);
el.featuresCloseBtn.addEventListener("click", closeFeaturesModal);
el.featuresAddBtn.addEventListener("click", openFeatureEditorModal);
el.featureEditorCancelBtn.addEventListener("click", closeFeatureEditorModal);
el.deliveryInfoCloseBtn.addEventListener("click", closeDeliveryInfoModal);
el.featureEditorSaveBtn.addEventListener("click", async () => {
  const projectKey = normalizeProjectKey(currentFeaturesProjectKey);
  const editId = String(currentFeatureEditId || "").trim();
  const name = el.featureEditorNameInput.value.trim();
  const description = el.featureEditorDescInput.value.trim();
  if (!projectKey) return;
  if (!name) {
    window.alert("Feature name is required.");
    return;
  }
  try {
    if (editId) {
      currentFeaturesEntries = currentFeaturesEntries.map((entry) =>
        entry.id === editId
          ? { ...entry, name, description }
          : entry
      );
    } else {
      currentFeaturesEntries.push({ id: uid(), name, description });
    }
    projectFeaturesCatalog[projectKey] = [...currentFeaturesEntries];
    await saveProjectFile(`${projectKey}/features.md`, featuresToMarkdown(projectKey, currentFeaturesEntries));
    renderFeaturesEntries();
    closeFeatureEditorModal();
    setStatus(`features updated (${projectKey})`);
  } catch (err) {
    window.alert(`Failed to save feature: ${err.message}`);
  }
});
el.timelineForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const projectKey = normalizeProjectKey(currentTimelineProjectKey);
  const name = el.timelineEventNameInput.value.trim();
  const date = el.timelineEventDateInput.value.trim();
  const description = el.timelineEventDescInput.value.trim();
  if (!projectKey) return;
  if (!name || !date) {
    window.alert("Event name and date are required.");
    return;
  }
  try {
    currentTimelineEntries.push(
      normalizeTimelineEntry({
        name,
        date,
        description,
      })
    );
    currentTimelineEntries.sort(compareTimelineEntries);
    await saveProjectTimeline(projectKey, currentTimelineEntries);
    renderTimelineEntries();
    el.timelineEventNameInput.value = "";
    el.timelineEventDateInput.value = "";
    el.timelineEventDescInput.value = "";
    setStatus(`timeline updated (${projectKey})`);
  } catch (err) {
    window.alert(`Failed to save timeline event: ${err.message}`);
  }
});
bindBackdropClose(el.assigneeModal, closeAssigneeModal);
bindBackdropClose(el.projectModal, closeProjectModal);
bindBackdropClose(el.copyTargetModal, closeCopyTargetModal);
bindBackdropClose(el.sprintModal, closeSprintModal);
bindBackdropClose(el.projectsModal, closeProjectsModal);
bindBackdropClose(el.pjsModal, closePjsModal);
bindBackdropClose(el.teamModal, closeTeamModal);
bindBackdropClose(el.timelineModal, closeTimelineModal);
bindBackdropClose(el.featuresModal, closeFeaturesModal);
bindBackdropClose(el.featureEditorModal, closeFeatureEditorModal);
bindBackdropClose(el.deliveryInfoModal, closeDeliveryInfoModal);

el.cancelTopicBtn.addEventListener("click", () => {
  el.topicForm.classList.add("hidden");
});

el.topicForm.addEventListener("submit", addTopic);

loadFromFiles();
