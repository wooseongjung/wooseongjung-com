/* eslint-env node */
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_NS3_ROOT_CANDIDATES = [
  '/Users/wsj/Documents/ns3_project/ns-3.46',
  '/workspace/ns-3.46',
];

const MAX_LIMIT = Number.parseInt(process.env.RUNS_KEEP_LATEST ?? '20', 10);
const PORT = Number.parseInt(process.env.PORT ?? '8080', 10);
const RUNNER_MODE = process.env.SIM_RUNNER ?? 'docker_exec';
const DOCKER_CONTAINER = process.env.NS3_DOCKER_CONTAINER ?? 'ns3-dev';
const NS3_RUN_WORKDIR = process.env.NS3_RUN_WORKDIR ?? '/workspace/ns-3.46';
const NS3_NR_BINARY_REL =
  process.env.NS3_BINARY_REL ?? 'build-linux-out/scratch/ns3.46-v2x-5g-sumo-default';
const NS3_NR_TRACE_FILE =
  process.env.NS3_TRACE_FILE ?? '/workspace/ns-3.46/scratch/manchester_city_ns3.tcl';
const NS3_DSRC_BINARY_REL =
  process.env.NS3_DSRC_BINARY_REL ?? 'build-linux-out/scratch/ns3.46-v2x-dsrc-sumo-direct-default';
const NS3_DSRC_TRACE_FILE =
  process.env.NS3_DSRC_TRACE_FILE ?? '/workspace/ns-3.46/scratch/manchester_city_ns3.tcl';
const NS3_LOCAL_ROOT =
  process.env.NS3_LOCAL_ROOT ??
  (await detectNs3Root()) ??
  '/Users/wsj/Documents/ns3_project/ns-3.46';
const NS3_LOCAL_RESULTS_ROOT =
  process.env.NS3_LOCAL_RESULTS_ROOT ?? path.join(NS3_LOCAL_ROOT, 'results_web');
const NS3_RUN_RESULTS_ROOT =
  process.env.NS3_RUN_RESULTS_ROOT ?? `${NS3_RUN_WORKDIR}/results_web`;
const MAP_CENTER_LAT = Number.parseFloat(process.env.MAP_CENTER_LAT ?? '53.4808');
const MAP_CENTER_LON = Number.parseFloat(process.env.MAP_CENTER_LON ?? '-2.2426');

const PARAM_LIMITS = {
  numVehicles: { min: 1, max: 150 },
  numGnbs: { min: 0, max: 30 },
  numVFCs: { min: 0, max: 50 },
  numCFNs: { min: 0, max: 50 },
  simTime: { min: 5, max: 120 },
};
const ACCESS_MODE_VALUES = new Set(['NR', 'DSRC_DIRECT']);
const SCENARIO_VALUES = new Set([
  'AUTO',
  'S1_CFN_ONLY',
  'S2_VFN_ONLY',
  'S3_HYBRID',
  'S0_NO_EDGE',
]);

const DB_PATH = path.join(__dirname, 'data', 'runs.json');
let runs = [];
let queue = [];
let activeRunId = null;
let activeRunnerProcess = null;
let activeRunCancelRequested = false;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', async (_req, res) => {
  const health = {
    ok: true,
    runner: RUNNER_MODE,
    activeRunId,
    queueDepth: queue.length,
  };

  if (RUNNER_MODE === 'docker_exec') {
    const status = await executeCommand(
      `docker inspect -f '{{.State.Status}}' ${shQuote(DOCKER_CONTAINER)} 2>/dev/null || echo missing`
    );
    health.runnerContainer = status.stdout.trim() || 'unknown';
  }

  res.json(health);
});

app.get('/api/simulations', (_req, res) => {
  res.json({
    activeRunId,
    queueDepth: queue.length,
    runs: runs.map(summarizeRun),
  });
});

app.get('/api/simulations/:id', async (req, res) => {
  const run = runs.find((item) => item.id === req.params.id);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }

  const payload = {
    ...run,
    logPath: undefined,
  };

  if (run.status === 'completed' && run.mapFilePath) {
    payload.mapAvailable = true;
  }

  res.json({ run: payload });
});

app.patch('/api/simulations/:id', async (req, res) => {
  const run = runs.find((item) => item.id === req.params.id);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }

  const next = req.body ?? {};
  if ('name' in next) {
    try {
      run.name = sanitizeRunName(next.name) ?? defaultRunName(run.id, run.scenario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if ('scenario' in next) {
    try {
      run.scenario = sanitizeScenario(next.scenario, run.params, run.accessMode ?? 'NR');
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  await persistRuns();
  return res.json({ run });
});

app.post('/api/simulations/:id/cancel', async (req, res) => {
  const run = runs.find((item) => item.id === req.params.id);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }

  if (run.status === 'queued') {
    queue = queue.filter((runId) => runId !== run.id);
    run.status = 'canceled';
    run.error = 'Canceled before execution';
    run.finishedAt = new Date().toISOString();
    await persistRuns();
    return res.json({ run: summarizeRun(run) });
  }

  if (run.status !== 'running' || activeRunId !== run.id) {
    return res.status(409).json({ error: `Cannot cancel run in status "${run.status}"` });
  }

  activeRunCancelRequested = true;
  run.error = 'Cancellation requested';
  await persistRuns();

  if (activeRunnerProcess && !activeRunnerProcess.killed) {
    activeRunnerProcess.kill('SIGTERM');
    setTimeout(() => {
      if (activeRunnerProcess && !activeRunnerProcess.killed) {
        activeRunnerProcess.kill('SIGKILL');
      }
    }, 2000);
  }

  // Best effort to terminate ns-3 inside the container in docker_exec mode.
  if (RUNNER_MODE === 'docker_exec') {
    const binaryName = path.basename(NS3_NR_BINARY_REL);
    await executeCommand(
      `docker exec ${shQuote(DOCKER_CONTAINER)} pkill -f ${shQuote(binaryName)} >/dev/null 2>&1 || true`
    );
  }

  return res.status(202).json({ run: summarizeRun(run) });
});

app.delete('/api/simulations/:id', async (req, res) => {
  const idx = runs.findIndex((item) => item.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Run not found' });
  }

  const run = runs[idx];
  if (run.status === 'running' || activeRunId === run.id) {
    return res.status(409).json({ error: 'Run is currently active. Cancel it first.' });
  }

  queue = queue.filter((runId) => runId !== run.id);
  runs.splice(idx, 1);

  if (run.outputDirLocal && run.outputDirLocal.startsWith(NS3_LOCAL_RESULTS_ROOT)) {
    try {
      await fs.rm(run.outputDirLocal, { recursive: true, force: true });
    } catch {
      // Keep API behavior deterministic even if cleanup fails.
    }
  }

  await persistRuns();
  return res.json({ deletedId: run.id });
});

app.get('/api/simulations/:id/map', async (req, res) => {
  const run = runs.find((item) => item.id === req.params.id);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }
  if (!run.mapFilePath) {
    return res.status(404).json({ error: 'Map animation is not available for this run' });
  }

  try {
    const raw = await fs.readFile(run.mapFilePath, 'utf8');
    res.json(JSON.parse(raw));
  } catch (error) {
    res.status(500).json({ error: `Failed to load map animation: ${error.message}` });
  }
});

app.post('/api/simulations', async (req, res) => {
  let runRequest;
  try {
    runRequest = sanitizeRunRequest(req.body ?? {});
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const { accessMode, params, name, scenario } = runRequest;
  const run = {
    id: createRunId(),
    name: name ?? null,
    accessMode,
    scenario,
    status: 'queued',
    createdAt: new Date().toISOString(),
    startedAt: null,
    finishedAt: null,
    params,
    error: null,
    command: null,
    outputDirLocal: null,
    outputDirRunner: null,
    logPath: null,
    mapFilePath: null,
    metrics: null,
    analysis: null,
  };
  run.name = run.name ?? defaultRunName(run.id, run.scenario);

  run.outputDirLocal = path.join(NS3_LOCAL_RESULTS_ROOT, run.id);
  run.outputDirRunner = `${NS3_RUN_RESULTS_ROOT}/${run.id}`;

  runs.unshift(run);
  queue.push(run.id);
  await persistRuns();
  processQueue().catch((error) => {
    console.error('Queue processor crashed:', error);
  });

  res.status(202).json({ run: summarizeRun(run) });
});

await initializeState();
app.listen(PORT, () => {
  console.log(`Simulation API listening on http://localhost:${PORT}`);
  console.log(`Runner mode: ${RUNNER_MODE}`);
  console.log(`NS-3 local root: ${NS3_LOCAL_ROOT}`);
  console.log(`Results root: ${NS3_LOCAL_RESULTS_ROOT}`);
});

async function initializeState() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.mkdir(NS3_LOCAL_RESULTS_ROOT, { recursive: true });

  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      runs = parsed.map((run) => {
        const params = run.params ?? {};
        let accessMode;
        try {
          accessMode = sanitizeAccessMode(run.accessMode ?? 'NR');
        } catch {
          accessMode = 'NR';
        }

        let normalizedParams;
        try {
          normalizedParams = normalizeParamsForAccessMode(params, accessMode);
        } catch {
          normalizedParams = params;
        }

        let scenario;
        try {
          scenario = sanitizeScenario(run.scenario ?? 'AUTO', normalizedParams, accessMode);
        } catch {
          scenario = inferScenario(normalizedParams);
        }

        const stalePending = run.status === 'running' || run.status === 'queued';
        let outputDirLocal = run.outputDirLocal ?? path.join(NS3_LOCAL_RESULTS_ROOT, run.id);
        if (RUNNER_MODE === 'docker_exec' && !outputDirLocal.startsWith(NS3_LOCAL_RESULTS_ROOT)) {
          // Old runs may contain host-only absolute paths; normalize to container-visible mount.
          outputDirLocal = path.join(NS3_LOCAL_RESULTS_ROOT, run.id);
        }

        const outputDirRunner = run.outputDirRunner ?? `${NS3_RUN_RESULTS_ROOT}/${run.id}`;
        let logPath = run.logPath ?? path.join(outputDirLocal, 'runner.log');
        if (RUNNER_MODE === 'docker_exec' && !logPath.startsWith(outputDirLocal)) {
          logPath = path.join(outputDirLocal, 'runner.log');
        }

        let mapFilePath = run.mapFilePath ?? path.join(outputDirLocal, 'map-animation.json');
        if (RUNNER_MODE === 'docker_exec' && !mapFilePath.startsWith(outputDirLocal)) {
          mapFilePath = path.join(outputDirLocal, 'map-animation.json');
        }

        return {
          ...run,
          accessMode,
          params: normalizedParams,
          scenario,
          name: sanitizeRunName(run.name) ?? defaultRunName(run.id, scenario),
          status: stalePending ? 'failed' : run.status,
          error: stalePending
            ? run.error ?? 'Recovered after API restart before execution completed. Please queue again.'
            : run.error ?? null,
          finishedAt: stalePending ? run.finishedAt ?? new Date().toISOString() : run.finishedAt,
          outputDirLocal,
          outputDirRunner,
          logPath,
          mapFilePath,
        };
      });
      queue = [];
      activeRunId = null;

      // Recovered history entries may have missing analysis blobs when runs.json was rebuilt.
      // Backfill from existing CSV/XML artifacts so detailed panels render correctly.
      const recoveredCompleted = runs.filter(
        (run) =>
          run.status === 'completed' &&
          run.outputDirLocal &&
          (!run.analysis || !run.metrics || !run.mapFilePath)
      );
      for (const run of recoveredCompleted) {
        try {
          const analysis = await parseRunOutputs(run);
          run.analysis = analysis;
          run.metrics = analysis.metrics;
          run.mapFilePath = analysis.mapFilePath;
          if (typeof run.error === 'string' && run.error.startsWith('Recovered')) {
            run.error = null;
          }
        } catch (error) {
          if (!run.error) {
            run.error = `Recovered run analysis unavailable: ${error.message}`;
          }
        }
      }

      await persistRuns();
      return;
    }
  } catch {
    // Ignore first-run parse errors.
  }

  runs = [];
  queue = [];
  activeRunId = null;
  await persistRuns();
}

function sanitizeRunRequest(payload) {
  const accessMode = sanitizeAccessMode(payload.accessMode);
  const params = sanitizeParams(payload);
  const normalizedParams = normalizeParamsForAccessMode(params, accessMode);
  const scenario = sanitizeScenario(payload.scenario ?? 'AUTO', normalizedParams, accessMode);
  const name = sanitizeRunName(payload.name ?? payload.runName);
  return { accessMode, params: normalizedParams, scenario, name };
}

function sanitizeParams(payload) {
  const values = {
    numVehicles: clampInteger(payload.numVehicles, PARAM_LIMITS.numVehicles.min, PARAM_LIMITS.numVehicles.max, 'numVehicles'),
    numGnbs: clampInteger(payload.numGnbs, PARAM_LIMITS.numGnbs.min, PARAM_LIMITS.numGnbs.max, 'numGnbs'),
    numVFCs: clampInteger(payload.numVFCs, PARAM_LIMITS.numVFCs.min, PARAM_LIMITS.numVFCs.max, 'numVFCs'),
    numCFNs: clampInteger(payload.numCFNs, PARAM_LIMITS.numCFNs.min, PARAM_LIMITS.numCFNs.max, 'numCFNs'),
    simTime: clampInteger(
      payload.simTime ?? 20,
      PARAM_LIMITS.simTime.min,
      PARAM_LIMITS.simTime.max,
      'simTime'
    ),
  };
  return values;
}

function sanitizeAccessMode(value) {
  const normalized = String(value ?? 'NR').trim().toUpperCase();
  if (!ACCESS_MODE_VALUES.has(normalized)) {
    throw new Error('accessMode must be one of NR, DSRC_DIRECT');
  }
  return normalized;
}

function normalizeParamsForAccessMode(params, accessMode) {
  const normalized = { ...params };
  if (accessMode === 'DSRC_DIRECT') {
    normalized.numGnbs = 0;
    normalized.numCFNs = 0;
    if (normalized.numVFCs < 1) {
      throw new Error('numVFCs must be >= 1 for DSRC_DIRECT mode');
    }
  } else {
    if (normalized.numGnbs < 1) {
      throw new Error('numGnbs must be >= 1 for NR mode');
    }
  }
  return normalized;
}

function inferScenario(params) {
  const hasCfn = (params?.numCFNs ?? 0) > 0;
  const hasVfn = (params?.numVFCs ?? 0) > 0;
  if (hasCfn && !hasVfn) {
    return 'S1_CFN_ONLY';
  }
  if (!hasCfn && hasVfn) {
    return 'S2_VFN_ONLY';
  }
  if (hasCfn && hasVfn) {
    return 'S3_HYBRID';
  }
  return 'S0_NO_EDGE';
}

function sanitizeScenario(value, params, accessMode = 'NR') {
  const normalized = String(value ?? 'AUTO').trim().toUpperCase();
  if (!SCENARIO_VALUES.has(normalized)) {
    throw new Error('scenario must be one of AUTO, S1_CFN_ONLY, S2_VFN_ONLY, S3_HYBRID, S0_NO_EDGE');
  }
  if (accessMode === 'DSRC_DIRECT') {
    if (normalized === 'AUTO') {
      return 'S2_VFN_ONLY';
    }
    if (normalized !== 'S2_VFN_ONLY') {
      throw new Error('scenario must be S2_VFN_ONLY (or AUTO) for DSRC_DIRECT mode');
    }
  }
  if (normalized === 'AUTO') {
    return inferScenario(params);
  }
  return normalized;
}

function sanitizeRunName(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }
  const clean = String(value).trim().replace(/\s+/g, ' ');
  if (clean.length > 80) {
    throw new Error('name must be 80 characters or fewer');
  }
  return clean;
}

function defaultRunName(runId, scenario) {
  return `${scenario} ${runId.slice(-6)}`;
}

function clampInteger(value, min, max, fieldName) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be an integer`);
  }
  if (parsed < min || parsed > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return parsed;
}

function createRunId() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const suffix = crypto.randomBytes(3).toString('hex');
  return `run_${stamp}_${suffix}`;
}

function createSafeRunPath(params) {
  return [
    `veh${params.numVehicles}`,
    `gnb${params.numGnbs}`,
    `vfc${params.numVFCs}`,
    `cfn${params.numCFNs}`,
  ].join('_');
}

function summarizeRun(run) {
  return {
    id: run.id,
    name: run.name,
    accessMode: run.accessMode ?? 'NR',
    scenario: run.scenario,
    status: run.status,
    createdAt: run.createdAt,
    startedAt: run.startedAt,
    finishedAt: run.finishedAt,
    params: run.params,
    error: run.error,
    metrics: run.metrics,
  };
}

async function persistRuns() {
  await fs.writeFile(DB_PATH, `${JSON.stringify(runs, null, 2)}\n`, 'utf8');
}

async function processQueue() {
  if (activeRunId || queue.length === 0) {
    return;
  }

  const runId = queue.shift();
  const run = runs.find((item) => item.id === runId);
  if (!run) {
    return processQueue();
  }

  activeRunId = runId;
  activeRunCancelRequested = false;
  run.status = 'running';
  run.startedAt = new Date().toISOString();
  run.error = null;
  await persistRuns();

  try {
    await fs.mkdir(run.outputDirLocal, { recursive: true });
    run.logPath = path.join(run.outputDirLocal, 'runner.log');

    const command = buildNs3Command(run);
    run.command = command;
    await persistRuns();

    if (activeRunCancelRequested) {
      throw new Error('Simulation canceled by user');
    }

    const { code, stdout, stderr } = await executeCommand(command, {
      onSpawn: (child) => {
        activeRunnerProcess = child;
      },
    });
    activeRunnerProcess = null;
    await fs.writeFile(run.logPath, `${stdout}\n${stderr}`, 'utf8');

    if (activeRunCancelRequested) {
      throw new Error('Simulation canceled by user');
    }

    if (code !== 0) {
      const detail = [stderr, stdout]
        .join('\n')
        .trim()
        .split(/\r?\n/)
        .filter(Boolean)
        .slice(-4)
        .join(' | ');
      throw new Error(
        detail
          ? `Simulation exited with code ${code}: ${detail}`
          : `Simulation exited with code ${code}`
      );
    }

    const analysis = await parseRunOutputs(run);
    run.analysis = analysis;
    run.metrics = analysis.metrics;
    run.mapFilePath = analysis.mapFilePath;
    run.status = 'completed';
  } catch (error) {
    if (activeRunCancelRequested) {
      run.status = 'canceled';
      run.error = 'Canceled by user';
    } else {
      run.status = 'failed';
      run.error = error.message;
    }
  } finally {
    run.finishedAt = new Date().toISOString();
    activeRunId = null;
    activeRunnerProcess = null;
    activeRunCancelRequested = false;

    await pruneRuns();
    await persistRuns();
    await processQueue();
  }
}

function buildNs3Command(run) {
  const { numVehicles, numGnbs, numVFCs, numCFNs, simTime } = run.params;
  const accessMode = run.accessMode ?? 'NR';
  const outputDir = run.outputDirRunner;
  const animFile = `${outputDir}/anim.xml`;
  const binaryRel = accessMode === 'DSRC_DIRECT' ? NS3_DSRC_BINARY_REL : NS3_NR_BINARY_REL;
  const traceFile = accessMode === 'DSRC_DIRECT' ? NS3_DSRC_TRACE_FILE : NS3_NR_TRACE_FILE;
  const binaryPath =
    RUNNER_MODE === 'local'
      ? path.join(NS3_LOCAL_ROOT, binaryRel)
      : `${NS3_RUN_WORKDIR}/${binaryRel}`;

  let ns3Command;
  if (accessMode === 'DSRC_DIRECT') {
    ns3Command = [
      shQuote(binaryPath),
      `--traceFile=${shQuote(traceFile)}`,
      `--numVehicles=${numVehicles}`,
      `--numBuses=${numVFCs}`,
      `--simTime=${simTime}`,
      `--outputDir=${shQuote(outputDir)}`,
      `--animFile=${shQuote(animFile)}`,
    ].join(' ');
  } else {
    ns3Command = [
      shQuote(binaryPath),
      `--traceFile=${shQuote(traceFile)}`,
      `--numVehicles=${numVehicles}`,
      `--numGnbs=${numGnbs}`,
      `--numBuses=${numVFCs}`,
      `--numRsus=${numCFNs}`,
      '--testMode=1',
      `--simTime=${simTime}`,
      `--outputDir=${shQuote(outputDir)}`,
      `--animFile=${shQuote(animFile)}`,
    ].join(' ');
  }

  if (RUNNER_MODE === 'local') {
    return `cd ${shQuote(NS3_LOCAL_ROOT)} && mkdir -p ${shQuote(outputDir)} && ${ns3Command}`;
  }

  return (
    `docker start ${shQuote(DOCKER_CONTAINER)} >/dev/null 2>&1 || true; ` +
    `docker exec ${shQuote(DOCKER_CONTAINER)} bash -lc ${shQuote(
      `cd ${NS3_RUN_WORKDIR} && mkdir -p ${outputDir} && ${ns3Command}`
    )}`
  );
}

function shQuote(value) {
  return `'${String(value).replace(/'/g, `'"'"'`)}'`;
}

function executeCommand(command, options = {}) {
  const { onSpawn } = options;
  return new Promise((resolve) => {
    const child = spawn('bash', ['-lc', command], {
      cwd: __dirname,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (typeof onSpawn === 'function') {
      onSpawn(child);
    }

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

async function parseRunOutputs(run) {
  const accessMode = run.accessMode ?? 'NR';
  const methodologyPath = path.join(run.outputDirLocal, 'results_methodology_a.csv');
  const tasksPath = path.join(run.outputDirLocal, 'results_tasks.csv');
  const summaryPath = path.join(
    run.outputDirLocal,
    accessMode === 'DSRC_DIRECT' ? 'dsrc-direct-summary.csv' : 'v2x-summary.csv'
  );
  const responsePath = path.join(run.outputDirLocal, 'results_response_path.csv');
  const radioPath = path.join(run.outputDirLocal, 'results_downlink_radio.csv');
  const reliabilityPath = path.join(run.outputDirLocal, 'results_reliability.csv');
  const animPath = path.join(run.outputDirLocal, 'anim.xml');

  const [failureByBin, delayComponents, summaryMetrics, reliability] = await Promise.all([
    parseFailureByVelocity(methodologyPath, tasksPath, accessMode),
    parseDelayComponents(tasksPath),
    parseSummary(summaryPath, accessMode),
    parseReliability(methodologyPath, tasksPath, responsePath, radioPath, reliabilityPath, accessMode),
  ]);

  const mapAnimation = await parseMapAnimation(animPath, run.params, accessMode);
  const mapFilePath = path.join(run.outputDirLocal, 'map-animation.json');
  await fs.writeFile(mapFilePath, `${JSON.stringify(mapAnimation, null, 2)}\n`, 'utf8');

  return {
    failureByBin,
    delayComponents,
    reliability,
    map: {
      center: mapAnimation.center,
      bounds: mapAnimation.bounds,
      frameStep: mapAnimation.frameStep,
      frameCount: mapAnimation.frames.length,
      nodeTypeCounts: mapAnimation.nodeTypeCounts,
    },
    metrics: {
      ...summaryMetrics,
      density: run.params.numVehicles,
      avgCompletionDelayS: delayComponents.completion,
      processedTasks: delayComponents.processedTasks,
      e2eReliability: reliability.e2eReliability,
      uplinkReliability: reliability.uplinkReliability,
      downlinkReliability: reliability.downlinkReliability,
      deadlineReliability: reliability.deadlineReliability,
    },
    mapFilePath,
  };
}

async function parseCsv(filePath) {
  let raw;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) {
    return [];
  }
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row = {};
    for (let i = 0; i < headers.length; i += 1) {
      row[headers[i]] = values[i] ?? '';
    }
    return row;
  });
}


function velocityBinLabel(value) {
  const numeric = Number.parseFloat(value);
  const safe = Number.isFinite(numeric) ? Math.max(numeric, 0) : 0;
  const lower = Math.floor(safe / 10) * 10;
  if (lower >= 100) {
    return '100+';
  }
  return `${lower}-${lower + 10}`;
}

async function parseFailureByVelocity(methodologyPath, tasksPath, accessMode = 'NR') {
  const rows = await parseCsv(methodologyPath);
  const grouped = new Map();

  if (rows.length > 0) {
    for (const row of rows) {
      const nodeType = row.Connected_Node_Type;
      // Accept both old 'gNB' and new 'CFN' labels for backward compatibility
      const normalizedType = nodeType === 'gNB' ? 'CFN' : nodeType;
      if (!['CFN', 'VFN'].includes(normalizedType)) {
        continue;
      }
      if (!['Tx', 'Rx'].includes(row.Packet_State)) {
        continue;
      }

      const bin = velocityBinLabel(row.Relative_Velocity_kmh);
      const key = `${bin}|${normalizedType}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          velocityBin: bin,
          nodeType: normalizedType,
          sent: 0,
          received: 0,
        });
      }

      const stats = grouped.get(key);
      if (row.Packet_State === 'Tx') {
        stats.sent += 1;
      } else {
        stats.received += 1;
      }
    }
  } else if (accessMode === 'DSRC_DIRECT') {
    const taskRows = await parseCsv(tasksPath);
    for (const row of taskRows) {
      const bin = velocityBinLabel(row.relative_velocity_kmh ?? row.Relative_Velocity_kmh);
      const key = `${bin}|VFN`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          velocityBin: bin,
          nodeType: 'VFN',
          sent: 0,
          received: 0,
        });
      }
      const stats = grouped.get(key);
      stats.sent += 1;
      if (Number.parseInt(row.success ?? '0', 10) === 1) {
        stats.received += 1;
      }
    }
  }

  const bins = [...new Set([...grouped.values()].map((item) => item.velocityBin))].sort(
    (a, b) => velocityBinSortKey(a) - velocityBinSortKey(b)
  );

  return bins.map((bin) => {
    const cfn = grouped.get(`${bin}|CFN`) ?? { sent: 0, received: 0 };
    const vfn = grouped.get(`${bin}|VFN`) ?? { sent: 0, received: 0 };
    return {
      velocityBin: bin,
      cfnFailureRate: cfn.sent > 0 ? 1 - Math.min(cfn.received, cfn.sent) / cfn.sent : null,
      vfnFailureRate: vfn.sent > 0 ? 1 - Math.min(vfn.received, vfn.sent) / vfn.sent : null,
      cfnSent: cfn.sent,
      vfnSent: vfn.sent,
    };
  });
}

function velocityBinSortKey(label) {
  if (label === '100+') {
    return 100;
  }
  return Number.parseInt(label.split('-', 1)[0], 10);
}

async function parseDelayComponents(tasksPath) {
  const rows = await parseCsv(tasksPath);
  let processedTasks = 0;
  let completion = 0;
  let queueing = 0;
  let service = 0;
  let migration = 0;
  let transport = 0;

  for (const row of rows) {
    const completionDelay = Number.parseFloat(row.completion_delay_s) || 0;
    const queueDelay = Number.parseFloat(row.queue_delay_s) || 0;
    const serviceDelay = Number.parseFloat(row.service_time_s) || 0;
    const migrationDelay = Number.parseFloat(row.migration_delay_s) || 0;
    const transportDelay = Math.max(completionDelay - queueDelay - serviceDelay, 0);

    completion += completionDelay;
    queueing += queueDelay;
    service += serviceDelay;
    migration += migrationDelay;
    transport += transportDelay;
    processedTasks += 1;
  }

  if (processedTasks === 0) {
    return {
      processedTasks: 0,
      completion: 0,
      queueing: 0,
      service: 0,
      migration: 0,
      transport: 0,
      shares: {
        transport: 0,
        queueing: 0,
        service: 0,
      },
    };
  }

  const avgCompletion = completion / processedTasks;
  const avgQueueing = queueing / processedTasks;
  const avgService = service / processedTasks;
  const avgMigration = migration / processedTasks;
  const avgTransport = transport / processedTasks;

  const denominator = avgTransport + avgQueueing + avgService;
  return {
    processedTasks,
    completion: avgCompletion,
    queueing: avgQueueing,
    service: avgService,
    migration: avgMigration,
    transport: avgTransport,
    shares: {
      transport: denominator > 0 ? avgTransport / denominator : 0,
      queueing: denominator > 0 ? avgQueueing / denominator : 0,
      service: denominator > 0 ? avgService / denominator : 0,
    },
  };
}

function safeDivide(num, den) {
  return den > 0 ? num / den : null;
}

async function parseReliability(
  methodologyPath,
  tasksPath,
  responsePath,
  radioPath,
  reliabilityPath,
  accessMode = 'NR'
) {
  const [methodRows, taskRows, responseRows, radioRows] = await Promise.all([
    parseCsv(methodologyPath),
    parseCsv(tasksPath),
    parseCsv(responsePath),
    parseCsv(radioPath),
  ]);

  let txTotal = 0;
  let rxTotal = 0;
  let droppedTotal = 0;
  let gnbTx = 0;
  let gnbRx = 0;
  let vfnTx = 0;
  let vfnRx = 0;
  let handoverEvents = 0;
  let fogReassociationEvents = 0;

  for (const row of methodRows) {
    const state = row.Packet_State;
    const type = row.Connected_Node_Type;
    // Accept both old 'gNB' and new 'CFN' labels
    const nType = type === 'gNB' ? 'CFN' : type;
    if (state === 'Tx') {
      txTotal += 1;
      if (nType === 'CFN') {
        gnbTx += 1;
      } else if (nType === 'VFN') {
        vfnTx += 1;
      }
    } else if (state === 'Rx') {
      rxTotal += 1;
      if (nType === 'CFN') {
        gnbRx += 1;
      } else if (nType === 'VFN') {
        vfnRx += 1;
      }
    } else if (state === 'Dropped') {
      droppedTotal += 1;
    }

    if (state === 'FogReassociation') {
      fogReassociationEvents += 1;
    }
    if (state === 'Handover' || Number.parseInt(row.Handover_Event ?? '0', 10) === 1) {
      handoverEvents += 1;
    }
  }

  const tasksReachingFog = taskRows.length;
  const tasksDeadlineOk = taskRows.filter((row) => Number.parseInt(row.success ?? '0', 10) === 1).length;
  const responsesSentByFog = responseRows.filter((row) => Number.parseInt(row.bytes_sent ?? '0', 10) > 0).length;

  const radioByStage = new Map();
  for (const row of radioRows) {
    const stage = row.Stage;
    radioByStage.set(stage, (radioByStage.get(stage) ?? 0) + 1);
  }
  const ulRlcTx = radioByStage.get('RLC_UL_TX') ?? 0;
  const ulRlcRx = radioByStage.get('RLC_UL_RX') ?? 0;
  const ulRlcTxDrop = radioByStage.get('RLC_UL_TX_DROP') ?? 0;
  const dlRlcTx = radioByStage.get('RLC_DL_TX') ?? 0;
  const dlRlcRx = radioByStage.get('RLC_DL_RX') ?? 0;
  const dlRlcTxDrop = radioByStage.get('RLC_DL_TX_DROP') ?? 0;

  const uplinkReliability = safeDivide(tasksReachingFog, txTotal);
  const downlinkReliability = safeDivide(rxTotal, responsesSentByFog);
  const deadlineReliability = safeDivide(tasksDeadlineOk, tasksReachingFog);
  const e2eReliability = safeDivide(tasksDeadlineOk, txTotal);

  if (accessMode === 'DSRC_DIRECT' && methodRows.length === 0) {
    const reliabilityRows = await parseCsv(reliabilityPath);
    const busRow =
      reliabilityRows.find((row) => String(row.NodeType).toUpperCase() === 'BUS') ?? {};
    const busTx = Number.parseInt(busRow.TotalTx ?? '0', 10) || taskRows.length;
    const busRx = Number.parseInt(busRow.TotalRx ?? '0', 10) || tasksDeadlineOk;
    const busLossRatio =
      Number.parseFloat(busRow.LossRatio ?? '') || (busTx > 0 ? 1 - busRx / busTx : 0);

    return {
      tasksSent: busTx,
      tasksReachingFog: taskRows.length,
      responsesSentByFog: taskRows.length,
      responsesReceivedByCar: busRx,
      tasksDeadlineOk: tasksDeadlineOk || busRx,
      methodDroppedCount: busTx - busRx,
      preFogLossCount: 0,
      returnPathLossCount: Math.max(taskRows.length - busRx, 0),
      deadlineMissAfterFogCount: Math.max(taskRows.length - (tasksDeadlineOk || busRx), 0),
      uplinkReliability: null,
      downlinkReliability: null,
      deadlineReliability: safeDivide(tasksDeadlineOk || busRx, taskRows.length),
      e2eReliability: safeDivide(tasksDeadlineOk || busRx, busTx),
      e2ePlr: busLossRatio,
      gnb: {
        tx: 0,
        rx: 0,
        failureRate: null,
      },
      vfn: {
        tx: busTx,
        rx: busRx,
        failureRate: busTx > 0 ? 1 - Math.min(busRx, busTx) / busTx : null,
      },
      handoverEvents: 0,
      fogReassociationEvents: 0,
      ulRlc: {
        tx: 0,
        rx: 0,
        txDrop: 0,
        reliability: null,
      },
      dlRlc: {
        tx: 0,
        rx: 0,
        txDrop: 0,
        reliability: null,
      },
    };
  }

  return {
    tasksSent: txTotal,
    tasksReachingFog,
    responsesSentByFog,
    responsesReceivedByCar: rxTotal,
    tasksDeadlineOk,
    methodDroppedCount: droppedTotal,
    preFogLossCount: Math.max(txTotal - tasksReachingFog, 0),
    returnPathLossCount: Math.max(responsesSentByFog - rxTotal, 0),
    deadlineMissAfterFogCount: Math.max(tasksReachingFog - tasksDeadlineOk, 0),
    uplinkReliability,
    downlinkReliability,
    deadlineReliability,
    e2eReliability,
    e2ePlr: e2eReliability == null ? null : 1 - e2eReliability,
    cfn: {
      tx: gnbTx,
      rx: gnbRx,
      failureRate: gnbTx > 0 ? 1 - Math.min(gnbRx, gnbTx) / gnbTx : null,
    },
    vfn: {
      tx: vfnTx,
      rx: vfnRx,
      failureRate: vfnTx > 0 ? 1 - Math.min(vfnRx, vfnTx) / vfnTx : null,
    },
    handoverEvents,
    fogReassociationEvents,
    ulRlc: {
      tx: ulRlcTx,
      rx: ulRlcRx,
      txDrop: ulRlcTxDrop,
      reliability: safeDivide(ulRlcRx, ulRlcTx),
    },
    dlRlc: {
      tx: dlRlcTx,
      rx: dlRlcRx,
      txDrop: dlRlcTxDrop,
      reliability: safeDivide(dlRlcRx, dlRlcTx),
    },
  };
}

async function parseSummary(summaryPath, accessMode = 'NR') {
  const rows = await parseCsv(summaryPath);
  if (rows.length === 0) {
    return {
      totalTasks: 0,
      successTasks: 0,
      successRate: 0,
      avgQueueDelayS: 0,
      avgCompletionDelayS: 0,
    };
  }

  if (accessMode === 'DSRC_DIRECT' && rows[0]?.Metric) {
    const byMetric = Object.fromEntries(rows.map((row) => [row.Metric, row.Value]));
    const totalTasks = Number.parseInt(byMetric.TotalTasksSent ?? '0', 10) || 0;
    const successTasks = Number.parseInt(byMetric.TotalResponsesReceived ?? '0', 10) || 0;
    const successRate = Number.parseFloat(byMetric.SuccessRate ?? '0') || 0;
    const avgCompletionDelayS = Number.parseFloat(byMetric.AvgCompletionDelayS ?? '0') || 0;
    return {
      totalTasks,
      successTasks,
      successRate,
      avgQueueDelayS: 0,
      avgCompletionDelayS,
    };
  }

  const row = rows[0];
  const result = {
    totalTasks: Number.parseInt(row.total_tasks ?? '0', 10) || 0,
    successTasks: Number.parseInt(row.success_tasks ?? '0', 10) || 0,
    successRate: Number.parseFloat(row.success_rate ?? '0') || 0,
    avgQueueDelayS: Number.parseFloat(row.avg_queue_delay_s ?? '0') || 0,
    avgCompletionDelayS: Number.parseFloat(row.avg_completion_delay_s ?? '0') || 0,
  };

  // Try to load end-to-end summary (includes network round-trip delay)
  const e2ePath = summaryPath.replace('-summary.csv', '-e2e-summary.csv');
  try {
    const e2eRows = await parseCsv(e2ePath);
    if (e2eRows.length > 0) {
      const e2e = e2eRows[0];
      result.e2eTotalTasks = Number.parseInt(e2e.e2e_total_tasks ?? '0', 10) || 0;
      result.e2eSuccessTasks = Number.parseInt(e2e.e2e_success_tasks ?? '0', 10) || 0;
      result.e2eSuccessRate = Number.parseFloat(e2e.e2e_success_rate ?? '0') || 0;
      result.e2eAvgDelayS = Number.parseFloat(e2e.e2e_avg_delay_s ?? '0') || 0;
    }
  } catch {
    // e2e summary not available (older simulation run)
  }

  return result;
}

async function parseMapAnimation(animPath, params, accessMode = 'NR') {
  const xml = await fs.readFile(animPath, 'utf8');
  const nodeRe = /<node\s+id="(\d+)"[^>]*locX="([\d.+-]+)"\s+locY="([\d.+-]+)"\s*\/>/g;
  const updateRe = /<nu\s+p="p"\s+t="([\d.+-]+)"\s+id="(\d+)"\s+x="([\d.+-]+)"\s+y="([\d.+-]+)"\s*\/>/g;

  const totalTracked =
    accessMode === 'DSRC_DIRECT'
      ? params.numVehicles + params.numVFCs
      : params.numGnbs + params.numVehicles + params.numCFNs + params.numVFCs;
  const trackedIds = new Set(Array.from({ length: totalTracked }, (_, index) => index));

  const updatesById = new Map();
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  function pushUpdate(id, t, x, y) {
    if (!trackedIds.has(id)) {
      return;
    }
    if (!updatesById.has(id)) {
      updatesById.set(id, []);
    }
    updatesById.get(id).push({ t, x, y });
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  for (const match of xml.matchAll(nodeRe)) {
    const id = Number.parseInt(match[1], 10);
    const x = Number.parseFloat(match[2]);
    const y = Number.parseFloat(match[3]);
    pushUpdate(id, 0, x, y);
  }

  for (const match of xml.matchAll(updateRe)) {
    const t = Number.parseFloat(match[1]);
    const id = Number.parseInt(match[2], 10);
    const x = Number.parseFloat(match[3]);
    const y = Number.parseFloat(match[4]);
    pushUpdate(id, t, x, y);
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    return {
      frameStep: 1,
      center: { lat: MAP_CENTER_LAT, lon: MAP_CENTER_LON },
      bounds: null,
      nodeTypeCounts: {},
      frames: [],
    };
  }

  for (const list of updatesById.values()) {
    list.sort((a, b) => a.t - b.t);
  }

  const frameStep = 1;
  const maxFrameTime = params.simTime;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const cosLat = Math.cos((MAP_CENTER_LAT * Math.PI) / 180);

  const frameCount = Math.floor(maxFrameTime / frameStep) + 1;
  const pointers = new Map();
  for (const id of updatesById.keys()) {
    pointers.set(id, 0);
  }

  const frames = [];
  const nodeTypeCounts = { gNB: 0, car: 0, CFN: 0, VFC: 0 };

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const t = frameIndex * frameStep;
    const nodes = [];

    for (const [id, history] of updatesById.entries()) {
      if (!history || history.length === 0) {
        continue;
      }

      let pointer = pointers.get(id) ?? 0;
      while (pointer + 1 < history.length && history[pointer + 1].t <= t) {
        pointer += 1;
      }
      pointers.set(id, pointer);

      const pos = history[pointer];
      const lat = MAP_CENTER_LAT + (pos.y - centerY) / 111320;
      const lon = MAP_CENTER_LON + (pos.x - centerX) / (111320 * Math.max(cosLat, 1e-6));
      const type = classifyNode(id, params, accessMode);
      nodes.push({ id, type, lat, lon, x: pos.x, y: pos.y });
    }

    frames.push({ time: t, nodes });
  }

  for (const id of trackedIds) {
    const type = classifyNode(id, params, accessMode);
    if (nodeTypeCounts[type] !== undefined) {
      nodeTypeCounts[type] += 1;
    }
  }

  return {
    frameStep,
    center: { lat: MAP_CENTER_LAT, lon: MAP_CENTER_LON },
    bounds: {
      minLat: MAP_CENTER_LAT + (minY - centerY) / 111320,
      maxLat: MAP_CENTER_LAT + (maxY - centerY) / 111320,
      minLon: MAP_CENTER_LON + (minX - centerX) / (111320 * Math.max(cosLat, 1e-6)),
      maxLon: MAP_CENTER_LON + (maxX - centerX) / (111320 * Math.max(cosLat, 1e-6)),
    },
    nodeTypeCounts,
    frames,
  };
}

function classifyNode(id, params, accessMode = 'NR') {
  if (accessMode === 'DSRC_DIRECT') {
    const carUpper = params.numVehicles;
    const vfcUpper = carUpper + params.numVFCs;
    if (id < carUpper) {
      return 'car';
    }
    if (id < vfcUpper) {
      return 'VFC';
    }
    return 'other';
  }

  const gnbUpper = params.numGnbs;
  const carUpper = gnbUpper + params.numVehicles;
  const cfnUpper = carUpper + params.numCFNs;
  const vfcUpper = cfnUpper + params.numVFCs;

  if (id < gnbUpper) {
    return 'gNB';
  }
  if (id < carUpper) {
    return 'car';
  }
  if (id < cfnUpper) {
    return 'CFN';
  }
  if (id < vfcUpper) {
    return 'VFC';
  }
  return 'other';
}

async function pruneRuns() {
  if (runs.length <= MAX_LIMIT) {
    return;
  }

  const keep = runs.slice(0, MAX_LIMIT);
  const drop = runs.slice(MAX_LIMIT);

  for (const run of drop) {
    if (run.outputDirLocal && run.outputDirLocal.startsWith(NS3_LOCAL_RESULTS_ROOT)) {
      try {
        await fs.rm(run.outputDirLocal, { recursive: true, force: true });
      } catch {
        // Ignore cleanup failures.
      }
    }
  }

  runs = keep;
  queue = queue.filter((runId) => runs.some((run) => run.id === runId));
}

async function detectNs3Root() {
  for (const candidate of DEFAULT_NS3_ROOT_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // keep searching
    }
  }
  return null;
}
