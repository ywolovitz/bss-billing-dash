// Shared structure definitions for the Month-End Billing Run dashboard.
// Edit labels/fields here if the process changes — both index.html and
// config.html read from this file. Actual VALUES live in data.json.

const INTAKE_STEP_DEFS = [
  { id: "nms_received",         label: "NMS File Received" },
  { id: "monthly_checks_sent",  label: "Initial checks for 'Monthly' orders sent to Zero One" },
  { id: "start_checks_sent",    label: "Initial checks for 'Start' orders sent to Zero One" },
  { id: "data_checks_sent",     label: "Initial checks for 'Data' sent to Zero One" },
];

const FIX_STEP_DEFS = [
  { id: "monthly_fixes_done", label: "Monthly fixes completed by Zero One" },
  { id: "start_fixes_done",   label: "Start fixes completed by Zero One" },
  { id: "data_fixes_done",    label: "Data fixes completed by Zero One" },
];

const FINAL_STEP_DEFS = [
  { id: "clean_file_dropbox", label: "Clean File uploaded to Drop Box" },
];

const STEP_DEFS = [...INTAKE_STEP_DEFS, ...FIX_STEP_DEFS];

function allStepDefs() {
  return [...INTAKE_STEP_DEFS, ...FIX_STEP_DEFS, ...FINAL_STEP_DEFS];
}

const ORDER_QUANTITY_FIELDS = [
  { key: "duplicates",         label: "Duplicates" },
  { key: "missing",            label: "Missing" },
  { key: "extras",             label: "Extras" },
  { key: "value_corrections",  label: "Value corrections" },
];

const DATA_QUANTITY_FIELDS = [
  { key: "customer_names",  label: "Customer names" },
  { key: "object_numbers",  label: "Object numbers" },
];

const MAPPING_DEFS = [
  { id: "monthly_product_codes", label: "Monthly Product Code mapping done" },
  { id: "start_product_codes",   label: "Start Product Code mapping done" },
  { id: "isps",                  label: "ISP Mapping done" },
  { id: "regions",               label: "Region Mapping done" },
];

const INSTALLATIONS_CHECKLIST_DEFS = [
  { id: "file_received",       label: "File received" },
  { id: "fixes_complete",      label: "Fixes complete" },
  { id: "region_mapping",      label: "Region mapping" },
  { id: "isp_mapping",         label: "ISP Mapping" },
  { id: "clean_files_dropbox", label: "Clean files uploaded to Dropbox" },
];

const PROJECT_DEFS = [
  { id: "core_gpon",      label: "Core-GPON",      defined: true,  type: "standard" },
  { id: "core_ae",        label: "Core-AE",        defined: true,  type: "standard" },
  { id: "reach_gpon",     label: "Reach-GPON",     defined: false, type: "standard" },
  { id: "key_gpon",       label: "Key-GPON",       defined: false, type: "standard" },
  { id: "installations",  label: "Installations",  defined: true,  type: "installations" },
];

const STATUS_META = {
  done:         { emoji: "\u2705", label: "Done",         className: "status-done" },
  in_progress:  { emoji: "\uD83D\uDD04", label: "In Progress", className: "status-in-progress" },
  pending:      { emoji: "\u23F3", label: "Pending",      className: "status-pending" },
  issue:        { emoji: "\u26A0\uFE0F", label: "Issue",  className: "status-issue" },
  na:           { emoji: "\u2014",  label: "N/A",         className: "status-na" },
};

const STATUS_OPTIONS = [
  { value: "pending",     label: "\u23F3 Pending" },
  { value: "in_progress", label: "\uD83D\uDD04 In Progress" },
  { value: "done",        label: "\u2705 Done" },
  { value: "issue",       label: "\u26A0\uFE0F Issue" },
  { value: "na",          label: "\u2014 N/A" },
];

function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.pending;
}

function isApplicableStatus(status) {
  return status !== "na";
}

function isInstallationsProject(def) {
  return def.type === "installations";
}

function emptyStep() {
  return { status: "pending", time: "", notes: "" };
}

function emptyInstallationsIteration(iteration = 1) {
  return { iteration, fix: "", fix_count: 0, sent_to_zo: "", completed_by_zo: "" };
}

function emptyInstallationsProject() {
  return {
    checklist: Object.fromEntries(INSTALLATIONS_CHECKLIST_DEFS.map(d => [d.id, emptyStep()])),
    iterations: [],
    notes: "",
  };
}

function emptyDefinedProject() {
  const steps = {};
  allStepDefs().forEach(s => { steps[s.id] = emptyStep(); });

  const mappings = {};
  MAPPING_DEFS.forEach(m => { mappings[m.id] = emptyStep(); });

  const quantities = {
    monthly: Object.fromEntries(ORDER_QUANTITY_FIELDS.map(f => [f.key, 0])),
    start:   Object.fromEntries(ORDER_QUANTITY_FIELDS.map(f => [f.key, 0])),
    data:    Object.fromEntries(DATA_QUANTITY_FIELDS.map(f => [f.key, 0])),
  };

  return { steps, quantities, mappings, notes: "" };
}

function getProjectData(def, projects) {
  if (!def.defined) return null;
  if (isInstallationsProject(def)) return projects[def.id] || emptyInstallationsProject();
  return projects[def.id] || emptyDefinedProject();
}

function projectTrackables(projectDef) {
  if (!projectDef.defined) return [];
  if (isInstallationsProject(projectDef)) {
    return INSTALLATIONS_CHECKLIST_DEFS.map(s => ({ kind: "inst_check", id: s.id }));
  }
  return [
    ...allStepDefs().map(s => ({ kind: "step", id: s.id })),
    ...MAPPING_DEFS.map(m => ({ kind: "mapping", id: m.id })),
  ];
}

function stepStatus(projectData, stepId) {
  return (projectData?.steps?.[stepId]?.status) || "pending";
}

function mappingStatus(projectData, mappingId) {
  return (projectData?.mappings?.[mappingId]?.status) || "pending";
}

function installationsCheckStatus(projectData, stepId) {
  return (projectData?.checklist?.[stepId]?.status) || "pending";
}

function trackableStatus(projectData, trackable, projectDef) {
  if (trackable.kind === "inst_check") return installationsCheckStatus(projectData, trackable.id);
  if (trackable.kind === "step") return stepStatus(projectData, trackable.id);
  return mappingStatus(projectData, trackable.id);
}

function projectProgress(projectDef, projectData) {
  const trackables = projectTrackables(projectDef);
  if (trackables.length === 0) return { done: 0, total: 0, pct: 0, na: 0 };
  const data = projectData || (isInstallationsProject(projectDef) ? emptyInstallationsProject() : emptyDefinedProject());
  let done = 0, applicable = 0, na = 0;
  trackables.forEach(t => {
    const status = trackableStatus(data, t, projectDef);
    if (!isApplicableStatus(status)) { na++; return; }
    applicable++;
    if (status === "done") done++;
  });
  return {
    done,
    total: applicable,
    na,
    pct: applicable ? Math.round((done / applicable) * 100) : 0,
  };
}

function overallProgress(projects) {
  let done = 0, total = 0, pending = 0, issue = 0, na = 0;
  PROJECT_DEFS.forEach(def => {
    if (!def.defined) return;
    const data = getProjectData(def, projects);
    projectTrackables(def).forEach(t => {
      const status = trackableStatus(data, t, def);
      if (!isApplicableStatus(status)) { na++; return; }
      total++;
      if (status === "done") done++;
      else if (status === "issue") issue++;
      else pending++;
    });
  });
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { done, pending, issue, na, total, pct };
}

function projectBarTone(projectDef, projectData) {
  if (!projectDef.defined) return "bar-undefined";
  const data = projectData || (isInstallationsProject(projectDef) ? emptyInstallationsProject() : emptyDefinedProject());
  let hasIssue = false;
  let hasInProgress = false;
  let applicable = 0;
  let done = 0;
  projectTrackables(projectDef).forEach(t => {
    const status = trackableStatus(data, t, projectDef);
    if (!isApplicableStatus(status)) return;
    applicable++;
    if (status === "issue") hasIssue = true;
    if (status === "in_progress") hasInProgress = true;
    if (status === "done") done++;
  });
  if (hasIssue) return "bar-issue";
  if (applicable > 0 && done === applicable) return "bar-done";
  if (hasInProgress) return "bar-in-progress";
  if (done > 0) return "bar-progress";
  return "bar-pending";
}

function projectHasNotes(data, projectDef) {
  if (!data) return false;
  if (isInstallationsProject(projectDef)) {
    if ((data.notes || "").trim()) return true;
    return Object.values(data.checklist || {}).some(item => (item.notes || "").trim());
  }
  if ((data.notes || "").trim()) return true;
  const buckets = [data.steps, data.mappings];
  return buckets.some(bucket =>
    bucket && Object.values(bucket).some(item => (item.notes || "").trim())
  );
}

const CHECKLIST_ROWS = [
  ...INTAKE_STEP_DEFS.map(s => ({ kind: "step", id: s.id, label: s.label })),
  ...FIX_STEP_DEFS.map(s => ({ kind: "step", id: s.id, label: s.label })),
  ...MAPPING_DEFS.map(m => ({ kind: "mapping", id: m.id, label: m.label })),
  ...FINAL_STEP_DEFS.map(s => ({ kind: "step", id: s.id, label: s.label })),
];

const QUANTITY_GROUPS = [
  { id: "monthly", label: "Monthly Orders — corrections needed", fields: ORDER_QUANTITY_FIELDS },
  { id: "start",   label: "Start Orders — corrections needed",   fields: ORDER_QUANTITY_FIELDS },
  { id: "data",    label: "Data — corrections needed",           fields: DATA_QUANTITY_FIELDS },
];
