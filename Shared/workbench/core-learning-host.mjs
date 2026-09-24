import {
  CORE_LEARNING_PAGE_TAG,
  validateCoreProjection,
} from "./core-learning-page.mjs";

const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));

export class CoreLearningHostError extends Error {
  constructor(code, detail = "") {
    super(detail ? `${code}: ${detail}` : code);
    this.name = "CoreLearningHostError";
    this.code = code;
    this.detail = detail;
  }
}

function requireCondition(condition, code, detail = "") {
  if (!condition) throw new CoreLearningHostError(code, detail);
}

function requireObject(value, code, detail = "") {
  requireCondition(value && typeof value === "object" && !Array.isArray(value), code, detail);
  return value;
}

function requireString(value, code, detail = "") {
  requireCondition(typeof value === "string" && value.trim().length > 0, code, detail);
  return value;
}

function projectionRows(data) {
  requireObject(data, "CORE_LEARNING_DATA_REQUIRED");
  const rows = data.core_projections;
  requireCondition(
    Array.isArray(rows),
    "CORE_LEARNING_PROJECTIONS_REQUIRED",
    "generated data must expose a precompiled core_projections array",
  );
  return rows;
}

export function resolveCoreLearningRecord(data, projectionId) {
  const id = requireString(projectionId, "CORE_LEARNING_PROJECTION_ID_REQUIRED");
  const rows = projectionRows(data);
  const matches = rows.filter((row) => row && row.id === id);
  requireCondition(matches.length === 1, "CORE_LEARNING_PROJECTION_NOT_FOUND", id);

  const record = requireObject(matches[0], "CORE_LEARNING_PROJECTION_RECORD_INVALID", id);
  const sourceRef = requireString(record.source_ref, "CORE_LEARNING_SOURCE_REF_INVALID", id);
  const projection = validateCoreProjection(
    requireObject(record.projection, "CORE_LEARNING_PROJECTION_ENVELOPE_REQUIRED", id),
  );

  const sceneRef = record.scene_ref == null
    ? null
    : requireString(record.scene_ref, "CORE_LEARNING_SCENE_REF_INVALID", id);
  const adapterRef = record.adapter_ref == null
    ? null
    : requireString(record.adapter_ref, "CORE_LEARNING_ADAPTER_REF_INVALID", id);

  requireCondition(
    (sceneRef == null) === (adapterRef == null),
    "CORE_LEARNING_WORKBENCH_BINDING_INCOMPLETE",
    id,
  );

  const injectionRefs = record.injection_refs == null ? [] : record.injection_refs;
  requireCondition(
    Array.isArray(injectionRefs) && injectionRefs.every((ref) => typeof ref === "string" && ref),
    "CORE_LEARNING_INJECTION_REFS_INVALID",
    id,
  );
  requireCondition(
    sceneRef != null || injectionRefs.length === 0,
    "CORE_LEARNING_INJECTION_BINDING_INCOMPLETE",
    id,
  );

  return {
    id,
    sourceRef,
    projection,
    sceneRef,
    adapterRef,
    injectionRefs: [...injectionRefs],
  };
}

function resolveRegistryEntry(registry, ref, code) {
  requireObject(registry, code);
  requireCondition(
    Object.prototype.hasOwnProperty.call(registry, ref),
    code,
    ref,
  );
  return registry[ref];
}

const PORTABLE_BINDABLE_CORES = new Set(["CORE1A", "CORE1B", "CORE2A", "CORE2B"]);

export function resolvePortableWorkbenchBinding(projectionInput, portablePackages = []) {
  const projection = validateCoreProjection(projectionInput);
  requireCondition(
    Array.isArray(portablePackages),
    "CORE_LEARNING_PORTABLE_PACKAGES_INVALID",
  );
  if (!PORTABLE_BINDABLE_CORES.has(projection.core)) return null;

  const representationRef = projection.presentation.initial_visual_ref;
  if (!representationRef) return null;

  const candidates = [];
  for (const packageRow of portablePackages) {
    if (!packageRow || typeof packageRow !== "object" || Array.isArray(packageRow)) continue;
    const provenance = packageRow.provenance || {};
    if (provenance.authority !== "CANONICAL_COMPILED_RESOURCE") continue;
    const representationRefs = Array.isArray(packageRow.representationRefs)
      ? packageRow.representationRefs
      : [];
    if (!representationRefs.includes(representationRef)) continue;
    requireCondition(
      representationRefs.length === 1,
      "CORE_LEARNING_PORTABLE_REPRESENTATION_AMBIGUOUS",
      String(packageRow.id || representationRef),
    );
    requireCondition(
      provenance.representationRef === representationRef,
      "CORE_LEARNING_PORTABLE_REPRESENTATION_MISMATCH",
      String(packageRow.id || representationRef),
    );
    requireObject(packageRow.scene, "CORE_LEARNING_PORTABLE_SCENE_INVALID", String(packageRow.id || ""));
    requireObject(packageRow.adapter, "CORE_LEARNING_PORTABLE_ADAPTER_INVALID", String(packageRow.id || ""));
    requireCondition(
      Array.isArray(packageRow.injections || []),
      "CORE_LEARNING_PORTABLE_INJECTIONS_INVALID",
      String(packageRow.id || ""),
    );
    candidates.push(packageRow);
  }

  requireCondition(
    candidates.length <= 1,
    "CORE_LEARNING_PORTABLE_REPRESENTATION_DUPLICATE",
    representationRef,
  );
  if (!candidates.length) return null;
  const packageRow = candidates[0];
  return {
    packageId: requireString(
      packageRow.id,
      "CORE_LEARNING_PORTABLE_PACKAGE_ID_REQUIRED",
      representationRef,
    ),
    scene: clone(packageRow.scene),
    adapter: clone(packageRow.adapter),
    injections: clone(packageRow.injections || []),
  };
}

export function resolveCoreLearningInputs(
  data,
  projectionId,
  {
    scenes = {},
    adapters = {},
    injections = {},
    portablePackages = [],
  } = {},
) {
  const record = resolveCoreLearningRecord(data, projectionId);
  if (!record.sceneRef) {
    const portable = resolvePortableWorkbenchBinding(record.projection, portablePackages);
    return {
      id: record.id,
      projection: clone(record.projection),
      scene: portable?.scene ?? null,
      adapter: portable?.adapter ?? null,
      injections: portable?.injections ?? [],
      portablePackageId: portable?.packageId ?? null,
    };
  }

  const scene = resolveRegistryEntry(
    scenes,
    record.sceneRef,
    "CORE_LEARNING_SCENE_NOT_FOUND",
  );
  const adapter = resolveRegistryEntry(
    adapters,
    record.adapterRef,
    "CORE_LEARNING_ADAPTER_NOT_FOUND",
  );
  const resolvedInjections = record.injectionRefs.map((ref) => resolveRegistryEntry(
    injections,
    ref,
    "CORE_LEARNING_INJECTION_NOT_FOUND",
  ));

  return {
    id: record.id,
    projection: clone(record.projection),
    scene,
    adapter,
    injections: resolvedInjections.map((row) => clone(row)),
    portablePackageId: null,
  };
}

export function mountCoreLearningPage(
  element,
  data,
  projectionId,
  registries = {},
) {
  requireCondition(
    element && typeof element === "object",
    "CORE_LEARNING_ELEMENT_REQUIRED",
  );
  requireCondition(
    element.localName === CORE_LEARNING_PAGE_TAG
      || element.tagName?.toLowerCase?.() === CORE_LEARNING_PAGE_TAG,
    "CORE_LEARNING_ELEMENT_INVALID",
    element.localName || element.tagName || "",
  );

  const inputs = resolveCoreLearningInputs(data, projectionId, registries);
  requireCondition(
    typeof element.configure === "function",
    "CORE_LEARNING_ELEMENT_CONFIGURE_REQUIRED",
  );
  element.configure({
    projection: inputs.projection,
    scene: inputs.scene,
    adapter: inputs.adapter,
    injections: inputs.injections,
  });

  return {
    id: inputs.id,
    workbenchBound: Boolean(inputs.scene && inputs.adapter),
    portablePackageId: inputs.portablePackageId ?? null,
  };
}
