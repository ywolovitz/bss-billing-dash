// Shared structure definitions for the Month-End Billing Run dashboard.
// Edit labels/fields here if the process changes — both index.html and
// config.html read from this file. Actual VALUES live in data.json.

const STEP_DEFS = [
  { id: "nms_received",         label: "NMS File Received" },
  { id: "monthly_checks_sent",  label: "Initial checks for 'Monthly' orders sent to Zero One" },
  { id: "start_checks_sent",    label: "Initial checks for 'Start' orders sent to Zero One" },
  { id: "data_checks_sent",     label: "Initial checks for 'Data' sent to Zero One" },
];

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
  { id: "product_codes", label: "Product Code mapping done" },
  { id: "isps",          label: "ISP Mapping done" },
  { id: "regions",       label: "Region Mapping done" },
];

const PROJECT_DEFS = [
  { id: "core_gpon",      label: "Core-GPON",      defined: true },
  { id: "core_ae",        label: "Core-AE",        defined: true },
  { id: "reach_gpon",     label: "Reach-GPON",     defined: false },
  { id: "key_gpon",       label: "Key-GPON",       defined: false },
  { id: "installations",  label: "Installations",  defined: false },
];

const STATUS_META = {
  done:    { emoji: "\u2705", label: "Done",    className: "status-done" },
  pending: { emoji: "\u23F3", label: "Pending", className: "status-pending" },
  issue:   { emoji: "\u26A0\uFE0F", label: "Issue", className: "status-issue" },
  na:      { emoji: "\u2014",  label: "N/A",     className: "status-na" },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "\u23F3 Pending" },
  { value: "done",    label: "\u2705 Done" },
  { value: "issue",   label: "\u26A0\uFE0F Issue" },
  { value: "na",      label: "\u2014 N/A" },
];

function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.pending;
}

function isApplicableStatus(status) {
  return status !== "na";
}

function emptyStep() {
  return { status: "pending", time: "", notes: "" };
}

function emptyDefinedProject() {
  const steps = {};
  STEP_DEFS.forEach(s => { steps[s.id] = emptyStep(); });

  const mappings = {};
  MAPPING_DEFS.forEach(m => { mappings[m.id] = emptyStep(); });

  const quantities = {
    monthly: Object.fromEntries(ORDER_QUANTITY_FIELDS.map(f => [f.key, 0])),
    start:   Object.fromEntries(ORDER_QUANTITY_FIELDS.map(f => [f.key, 0])),
    data:    Object.fromEntries(DATA_QUANTITY_FIELDS.map(f => [f.key, 0])),
  };

  return { steps, quantities, mappings, notes: "" };
}

function projectTrackables(projectDef) {
  if (!projectDef.defined) return [];
  return [
    ...STEP_DEFS.map(s => ({ kind: "step", id: s.id })),
    ...MAPPING_DEFS.map(m => ({ kind: "mapping", id: m.id })),
  ];
}

function stepStatus(projectData, stepId) {
  return (projectData?.steps?.[stepId]?.status) || "pending";
}

function mappingStatus(projectData, mappingId) {
  return (projectData?.mappings?.[mappingId]?.status) || "pending";
}

function trackableStatus(projectData, trackable) {
  return trackable.kind === "step"
    ? stepStatus(projectData, trackable.id)
    : mappingStatus(projectData, trackable.id);
}

function projectProgress(projectDef, projectData) {
  const trackables = projectTrackables(projectDef);
  if (trackables.length === 0) return { done: 0, total: 0, pct: 0, na: 0 };
  let done = 0, applicable = 0, na = 0;
  trackables.forEach(t => {
    const status = trackableStatus(projectData, t);
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
    const data = projects[def.id] || emptyDefinedProject();
    projectTrackables(def).forEach(t => {
      const status = trackableStatus(data, t);
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
  const data = projectData || emptyDefinedProject();
  let hasIssue = false;
  let applicable = 0;
  let done = 0;
  projectTrackables(projectDef).forEach(t => {
    const status = trackableStatus(data, t);
    if (!isApplicableStatus(status)) return;
    applicable++;
    if (status === "issue") hasIssue = true;
    if (status === "done") done++;
  });
  if (hasIssue) return "bar-issue";
  if (applicable > 0 && done === applicable) return "bar-done";
  if (done > 0) return "bar-progress";
  return "bar-pending";
}

// All checklist rows (steps + mappings)
const CHECKLIST_ROWS = [
  ...STEP_DEFS.map(s => ({ kind: "step", id: s.id, label: s.label })),
  ...MAPPING_DEFS.map(m => ({ kind: "mapping", id: m.id, label: m.label })),
];

const QUANTITY_GROUPS = [
  { id: "monthly", label: "Monthly Orders — corrections needed", fields: ORDER_QUANTITY_FIELDS },
  { id: "start",   label: "Start Orders — corrections needed",   fields: ORDER_QUANTITY_FIELDS },
  { id: "data",    label: "Data — corrections needed",           fields: DATA_QUANTITY_FIELDS },
];
