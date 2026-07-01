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

const KEY_GPON_CHECKLIST_DEFS = [
  { id: "raw_file_received",    label: "Raw File received" },
  { id: "api_file_checked",     label: "API file checked" },
  { id: "data_cleared",         label: "Data cleared", conditional: true },
  { id: "file_imported",        label: "File Imported", conditional: true },
  { id: "value_checks",         label: "Value checks" },
  { id: "region_mapping",       label: "Region Mapping" },
  { id: "isp_mapping",          label: "ISP Mapping" },
  { id: "product_code_mapping", label: "Product Code Mapping" },
];

const KEY_GPON_CONDITIONAL_STEP_IDS = ["data_cleared", "file_imported"];

const REACH_GPON_FILE_IMPORT_COUNT = 5;

const REACH_GPON_FILE_IMPORT_DEFS = Array.from(
  { length: REACH_GPON_FILE_IMPORT_COUNT },
  (_, i) => ({
    id: `file_import_${i + 1}_of_${REACH_GPON_FILE_IMPORT_COUNT}`,
    label: `Import ${i + 1} of ${REACH_GPON_FILE_IMPORT_COUNT}`,
    conditional: true,
  })
);

const REACH_GPON_CHECKLIST_DEFS = [
  { id: "raw_file_received",    label: "Raw File received" },
  { id: "api_file_checked",     label: "API file checked" },
  { id: "data_cleared",         label: "Data cleared", conditional: true },
  ...REACH_GPON_FILE_IMPORT_DEFS,
  { id: "value_checks",         label: "Value checks" },
  { id: "region_mapping",       label: "Region Mapping" },
  { id: "isp_mapping",          label: "ISP Mapping" },
  { id: "product_code_mapping", label: "Product Code Mapping" },
];

const REACH_GPON_CONDITIONAL_STEP_IDS = [
  "data_cleared",
  ...REACH_GPON_FILE_IMPORT_DEFS.map(d => d.id),
];

const GPON_VARIANT_API_RESULT_OPTIONS = [
  { value: "",         label: "— Pending" },
  { value: "ok",       label: "OK" },
  { value: "no_match", label: "No Match" },
];

const GPON_VARIANT_COMPARISON_DEFS = [
  { id: "record_count",          label: "Record Count" },
  { id: "bill_isp_excl",         label: "Bill ISP Excl." },
  { id: "current_period_rev",    label: "Current Period Rev" },
  { id: "current_period_days",   label: "Current Period Days" },
  { id: "deferral_period_rev",   label: "Deferral Period Rev" },
  { id: "deferral_period_days",  label: "Deferral Period Days" },
];

const GPON_VARIANT_REGISTRY = {
  key_gpon: {
    checklistDefs: KEY_GPON_CHECKLIST_DEFS,
    conditionalStepIds: KEY_GPON_CONDITIONAL_STEP_IDS,
    conditionalHint: "If OK, Data cleared and File Imported are not required.",
  },
  reach_gpon: {
    checklistDefs: REACH_GPON_CHECKLIST_DEFS,
    conditionalStepIds: REACH_GPON_CONDITIONAL_STEP_IDS,
    conditionalHint: "If OK, Data cleared and file imports (1–5 of 5) are not required.",
  },
};

// Backward-compatible aliases
const KEY_GPON_API_RESULT_OPTIONS = GPON_VARIANT_API_RESULT_OPTIONS;
const KEY_GPON_COMPARISON_DEFS = GPON_VARIANT_COMPARISON_DEFS;

const PROJECT_DEFS = [
  { id: "core_gpon",      label: "Core-GPON",      defined: true,  type: "standard" },
  { id: "core_ae",        label: "Core-AE",        defined: true,  type: "standard" },
  { id: "reach_gpon",     label: "Reach-GPON",     defined: true,  type: "reach_gpon" },
  { id: "key_gpon",       label: "Key-GPON",       defined: true,  type: "key_gpon" },
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

function isKeyGponProject(def) {
  return def.type === "key_gpon";
}

function isReachGponProject(def) {
  return def.type === "reach_gpon";
}

function isGponVariantProject(def) {
  return isKeyGponProject(def) || isReachGponProject(def);
}

function gponVariantMeta(def) {
  return GPON_VARIANT_REGISTRY[def.id] || null;
}

function gponVariantChecklistDefs(def) {
  return gponVariantMeta(def)?.checklistDefs || [];
}

function gponVariantConditionalStepIds(def) {
  return gponVariantMeta(def)?.conditionalStepIds || [];
}

function gponVariantStepApplicable(projectData, stepId, projectDef) {
  if (!gponVariantConditionalStepIds(projectDef).includes(stepId)) return true;
  return (projectData?.api_check_result || "") !== "ok";
}

function gponVariantCheckStatus(projectData, stepId, projectDef) {
  if (!gponVariantStepApplicable(projectData, stepId, projectDef)) return "na";
  return (projectData?.checklist?.[stepId]?.status) || "pending";
}

function gponVariantApiResultStatus(projectData) {
  const result = projectData?.api_check_result || "";
  if (result === "ok" || result === "no_match") return "done";
  return "pending";
}

// Backward-compatible aliases
function keyGponStepApplicable(projectData, stepId) {
  return gponVariantStepApplicable(projectData, stepId, { id: "key_gpon", type: "key_gpon" });
}

function comparisonDiff(raw, bss) {
  const r = Number(raw) || 0;
  const b = Number(bss) || 0;
  return b - r;
}

function formatComparisonValue(value) {
  if (value === "" || value === null || value === undefined) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
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

function emptyGponVariantProject(def) {
  const checklistDefs = gponVariantChecklistDefs(def);
  return {
    checklist: Object.fromEntries(checklistDefs.map(d => [d.id, emptyStep()])),
    api_check_result: "",
    value_comparison: Object.fromEntries(
      GPON_VARIANT_COMPARISON_DEFS.map(d => [d.id, { raw: 0, bss: 0 }])
    ),
    notes: "",
  };
}

function emptyKeyGponProject() {
  return emptyGponVariantProject({ id: "key_gpon", type: "key_gpon" });
}

function emptyReachGponProject() {
  return emptyGponVariantProject({ id: "reach_gpon", type: "reach_gpon" });
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
  if (isGponVariantProject(def)) return projects[def.id] || emptyGponVariantProject(def);
  return projects[def.id] || emptyDefinedProject();
}

function projectTrackables(projectDef) {
  if (!projectDef.defined) return [];
  if (isInstallationsProject(projectDef)) {
    return INSTALLATIONS_CHECKLIST_DEFS.map(s => ({ kind: "inst_check", id: s.id }));
  }
  if (isGponVariantProject(projectDef)) {
    const trackables = gponVariantChecklistDefs(projectDef)
      .map(s => ({ kind: "gpon_check", id: s.id }));
    trackables.push({ kind: "gpon_api_result", id: "api_check_result" });
    return trackables;
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
  if (trackable.kind === "gpon_check") return gponVariantCheckStatus(projectData, trackable.id, projectDef);
  if (trackable.kind === "gpon_api_result") return gponVariantApiResultStatus(projectData);
  if (trackable.kind === "step") return stepStatus(projectData, trackable.id);
  return mappingStatus(projectData, trackable.id);
}

function projectProgress(projectDef, projectData) {
  const trackables = projectTrackables(projectDef);
  if (trackables.length === 0) return { done: 0, total: 0, pct: 0, na: 0 };
  const data = projectData || (
    isInstallationsProject(projectDef) ? emptyInstallationsProject()
    : isGponVariantProject(projectDef) ? emptyGponVariantProject(projectDef)
    : emptyDefinedProject()
  );
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
  const data = projectData || (
    isInstallationsProject(projectDef) ? emptyInstallationsProject()
    : isGponVariantProject(projectDef) ? emptyGponVariantProject(projectDef)
    : emptyDefinedProject()
  );
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
  if (isInstallationsProject(projectDef) || isGponVariantProject(projectDef)) {
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
