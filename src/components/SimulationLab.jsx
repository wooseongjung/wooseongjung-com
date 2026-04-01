import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  LabelList,
} from 'recharts';
import {
  Loader2,
  Play,
  Pause,
  Send,
  ChevronDown,
  ChevronUp,
  Square,
  Trash2,
  Save,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

/* ── constants ── */
const API_BASE = import.meta.env.VITE_SIM_API_BASE || '';
const NODE_COLORS = { gNB: '#3b82f6', car: '#22c55e', CFN: '#f59e0b', VFC: '#a855f7' };
const SCENARIO_COLORS = ['#2563eb', '#7c3aed', '#16a34a', '#ea580c', '#0f766e'];
const DELAY_KEYS = [
  { key: 'transportMs', name: 'Transport', color: '#6366f1', pctKey: 'transportPct' },
  { key: 'queueingMs', name: 'Queueing', color: '#f59e0b', pctKey: 'queueingPct' },
  { key: 'serviceMs', name: 'Service', color: '#22c55e', pctKey: 'servicePct' },
];
const SCENARIO_LABELS = {
  S1_CFN_ONLY: 'S1 • CFN Only',
  S2_VFN_ONLY: 'S2 • VFN Only',
  S3_HYBRID: 'S3 • Hybrid',
  S0_NO_EDGE: 'S0 • No Edge',
};
const SCENARIO_VALUES = ['AUTO', 'S1_CFN_ONLY', 'S2_VFN_ONLY', 'S3_HYBRID', 'S0_NO_EDGE'];
const ACCESS_MODE_LABELS = {
  NR: '5G NR (Cellular-routed)',
  DSRC_DIRECT: 'DSRC 802.11p (Direct car↔VFN)',
};
const SUGGESTED_SETUPS = [
  { label: 'Off-Peak S1', accessMode: 'NR', scenario: 'S1_CFN_ONLY', params: { numVehicles: 40, numGnbs: 4, numVFCs: 0, numCFNs: 6, simTime: 100 } },
  { label: 'Off-Peak S2', accessMode: 'NR', scenario: 'S2_VFN_ONLY', params: { numVehicles: 40, numGnbs: 4, numVFCs: 6, numCFNs: 0, simTime: 100 } },
  { label: 'Off-Peak S3', accessMode: 'NR', scenario: 'S3_HYBRID', params: { numVehicles: 40, numGnbs: 4, numVFCs: 3, numCFNs: 3, simTime: 100 } },
  { label: 'Peak S1', accessMode: 'NR', scenario: 'S1_CFN_ONLY', params: { numVehicles: 100, numGnbs: 8, numVFCs: 0, numCFNs: 12, simTime: 100 } },
  { label: 'Peak S2', accessMode: 'NR', scenario: 'S2_VFN_ONLY', params: { numVehicles: 100, numGnbs: 8, numVFCs: 12, numCFNs: 0, simTime: 100 } },
  { label: 'Peak S3', accessMode: 'NR', scenario: 'S3_HYBRID', params: { numVehicles: 100, numGnbs: 8, numVFCs: 6, numCFNs: 6, simTime: 100 } },
  { label: 'DSRC Off-Peak', accessMode: 'DSRC_DIRECT', scenario: 'S2_VFN_ONLY', params: { numVehicles: 40, numGnbs: 0, numVFCs: 6, numCFNs: 0, simTime: 100 } },
  { label: 'DSRC Peak', accessMode: 'DSRC_DIRECT', scenario: 'S2_VFN_ONLY', params: { numVehicles: 100, numGnbs: 0, numVFCs: 12, numCFNs: 0, simTime: 100 } },
];

const defaultParams = {
  numVehicles: 40,
  accessMode: 'NR',
  numGnbs: 4,
  numVFCs: 7,
  numCFNs: 7,
  simTime: 60,
  scenario: 'AUTO',
  runName: '',
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Number.parseInt(v, 10) || lo));

/* ============================================================
   Main Component
   ============================================================ */
const SimulationLab = () => {
  const [params, setParams] = useState(defaultParams);
  const [runs, setRuns] = useState([]);
  const [activeRunId, setActiveRunId] = useState(null);
  const [queueDepth, setQueueDepth] = useState(0);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [runDetail, setRunDetail] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [deletingRunId, setDeletingRunId] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState('');
  const [historyScenarioFilter, setHistoryScenarioFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [compareRunIds, setCompareRunIds] = useState([]);
  const [compareRunDetails, setCompareRunDetails] = useState({});

  const selectedRun = useMemo(() => runs.find((r) => r.id === selectedRunId) ?? null, [runs, selectedRunId]);
  const isDsrcMode = params.accessMode === 'DSRC_DIRECT';

  const runLabel = useCallback((run) => {
    if (!run) return '—';
    return (run.name && run.name.trim()) || run.id.slice(-6);
  }, []);

  /* ── fetchers ── */
  const fetchRuns = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/simulations`);
      if (!r.ok) throw new Error(`${r.status}`);
      const d = await r.json();
      const nextRuns = Array.isArray(d.runs) ? d.runs : [];
      setRuns(nextRuns);
      setActiveRunId(d.activeRunId ?? null);
      setQueueDepth(d.queueDepth ?? 0);
      if (!selectedRunId && nextRuns.length) {
        setSelectedRunId(nextRuns[0].id);
      } else if (selectedRunId && !nextRuns.some((run) => run.id === selectedRunId)) {
        setSelectedRunId(nextRuns[0]?.id ?? null);
      }
    } catch (e) { setError(e.message); }
  }, [selectedRunId]);

  const fetchRunDetail = useCallback(async (id) => {
    try {
      const r = await fetch(`${API_BASE}/api/simulations/${id}`);
      if (!r.ok) throw new Error(`${r.status}`);
      const d = await r.json();
      setRunDetail(d.run ?? null);
      if (d.run?.status === 'completed' && (!mapData || mapData.id !== id)) {
        const mr = await fetch(`${API_BASE}/api/simulations/${id}/map`);
        if (mr.ok) { const md = await mr.json(); setMapData(md); setFrameIndex(0); }
      }
    } catch (e) { setError(e.message); }
  }, [mapData]);

  /* ── polling ── */
  useEffect(() => {
    fetchRuns();
    const t = setInterval(fetchRuns, 5000);
    return () => clearInterval(t);
  }, [fetchRuns]);

  useEffect(() => {
    if (!selectedRunId) { setRunDetail(null); setMapData(null); return; }
    fetchRunDetail(selectedRunId);
    const shouldPoll = selectedRun?.status === 'queued' || selectedRun?.status === 'running';
    if (!shouldPoll) return;
    const t = setInterval(() => fetchRunDetail(selectedRunId), 3000);
    return () => clearInterval(t);
  }, [fetchRunDetail, selectedRunId, selectedRun?.status]);

  useEffect(() => {
    if (!mapData?.frames?.length) { setFrameIndex(0); return; }
    if (!isPlaying) return;
    const t = setInterval(() => setFrameIndex((p) => (p + 1) % mapData.frames.length), 600);
    return () => clearInterval(t);
  }, [isPlaying, mapData]);

  useEffect(() => {
    if (runDetail?.name) {
      setRenameDraft(runDetail.name);
    } else if (runDetail) {
      setRenameDraft(runDetail.id.slice(-8));
    } else {
      setRenameDraft('');
    }
  }, [runDetail?.id, runDetail?.name]);

  useEffect(() => {
    if (!selectedRunId) return;
    setCompareRunIds((prev) => (prev.length ? prev : [selectedRunId]));
  }, [selectedRunId]);

  useEffect(() => {
    if (!runDetail?.id) return;
    setCompareRunDetails((prev) => ({ ...prev, [runDetail.id]: runDetail }));
  }, [runDetail]);

  useEffect(() => {
    const validIds = new Set(runs.map((run) => run.id));
    setCompareRunIds((prev) => prev.filter((id) => validIds.has(id)));
    setCompareRunDetails((prev) => {
      const next = {};
      for (const [id, detail] of Object.entries(prev)) {
        if (validIds.has(id)) {
          next[id] = detail;
        }
      }
      return next;
    });
  }, [runs]);

  useEffect(() => {
    const missingIds = compareRunIds.filter((id) => !compareRunDetails[id]);
    if (!missingIds.length) return;

    let cancelled = false;
    (async () => {
      try {
        const fetched = await Promise.all(
          missingIds.map(async (id) => {
            const r = await fetch(`${API_BASE}/api/simulations/${id}`);
            if (!r.ok) throw new Error(`${r.status}`);
            const d = await r.json();
            return [id, d.run ?? null];
          }),
        );
        if (cancelled) return;
        setCompareRunDetails((prev) => {
          const next = { ...prev };
          for (const [id, detail] of fetched) {
            if (detail) next[id] = detail;
          }
          return next;
        });
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [compareRunDetails, compareRunIds]);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSubmitting(true); setError('');
    try {
      const payload = {
        numVehicles: clamp(params.numVehicles, 1, 150),
        numGnbs: isDsrcMode ? 0 : clamp(params.numGnbs, 1, 30),
        numVFCs: clamp(params.numVFCs, 0, 50),
        numCFNs: isDsrcMode ? 0 : clamp(params.numCFNs, 0, 50),
        simTime: clamp(params.simTime, 5, 120),
        accessMode: params.accessMode || 'NR',
        scenario: isDsrcMode ? 'S2_VFN_ONLY' : (params.scenario || 'AUTO'),
        name: (params.runName || '').trim() || undefined,
      };
      const r = await fetch(`${API_BASE}/api/simulations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!r.ok) { const b = await r.json().catch(() => ({})); throw new Error(b.error || `${r.status}`); }
      const d = await r.json();
      setSelectedRunId(d.run.id);
      await fetchRuns();
      await fetchRunDetail(d.run.id);
    } catch (e) { setError(e.message); } finally { setSubmitting(false); }
  }

  async function handleCancelActiveRun() {
    if (!activeRunId || canceling) return;
    setCanceling(true);
    setError('');
    try {
      const r = await fetch(`${API_BASE}/api/simulations/${activeRunId}/cancel`, { method: 'POST' });
      if (!r.ok) {
        const b = await r.json().catch(() => ({}));
        throw new Error(b.error || `${r.status}`);
      }
      await fetchRuns();
      if (selectedRunId) {
        await fetchRunDetail(selectedRunId);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setCanceling(false);
    }
  }

  async function handleDeleteRun(runId) {
    if (!runId || deletingRunId) return;
    setDeletingRunId(runId);
    setError('');
    try {
      const r = await fetch(`${API_BASE}/api/simulations/${runId}`, { method: 'DELETE' });
      if (!r.ok) {
        const b = await r.json().catch(() => ({}));
        throw new Error(b.error || `${r.status}`);
      }
      if (selectedRunId === runId) {
        setRunDetail(null);
        setMapData(null);
      }
      await fetchRuns();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingRunId(null);
    }
  }

  async function handleRenameRun() {
    if (!selectedRunId || renaming) return;
    const nextName = renameDraft.trim();
    if (!nextName) {
      setError('Run name cannot be empty.');
      return;
    }
    setRenaming(true);
    setError('');
    try {
      const r = await fetch(`${API_BASE}/api/simulations/${selectedRunId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nextName }),
      });
      if (!r.ok) {
        const b = await r.json().catch(() => ({}));
        throw new Error(b.error || `${r.status}`);
      }
      const d = await r.json();
      setRunDetail(d.run ?? null);
      await fetchRuns();
    } catch (e) {
      setError(e.message);
    } finally {
      setRenaming(false);
    }
  }

  function applySuggestedSetup(setup) {
    if (!setup) return;
    setParams((p) => ({
      ...p,
      ...setup.params,
      accessMode: setup.accessMode || 'NR',
      scenario: setup.scenario,
      runName: setup.label,
    }));
  }

  function toggleCompareRun(runId) {
    setCompareRunIds((prev) => {
      if (prev.includes(runId)) {
        const next = prev.filter((id) => id !== runId);
        return next.length ? next : [runId];
      }
      return [...prev, runId];
    });
  }

  /* ── derived data ── */
  const visibleRuns = useMemo(() => {
    if (historyScenarioFilter === 'ALL') {
      return runs;
    }
    return runs.filter((run) => run.scenario === historyScenarioFilter);
  }, [runs, historyScenarioFilter]);

  const comparedRuns = useMemo(() => {
    return compareRunIds
      .map((id) => {
        if (runDetail?.id === id) return runDetail;
        return compareRunDetails[id] ?? null;
      })
      .filter(Boolean);
  }, [compareRunDetails, compareRunIds, runDetail]);

  const completedComparedRuns = useMemo(() => {
    return comparedRuns.filter((run) => run.status === 'completed' && run.analysis && run.metrics);
  }, [comparedRuns]);

  const failureData = useMemo(() => {
    if (!runDetail?.analysis?.failureByBin) return [];
    return runDetail.analysis.failureByBin.map((row) => ({
      velocityBin: row.velocityBin,
      CFN: row.cfnFailureRate ?? row.gNBFailureRate,
      VFN: row.vfnFailureRate,
      cfnTxCount: row.cfnSent ?? row.gNBSent ?? 0,
      vfnTxCount: row.vfnSent ?? 0,
    }));
  }, [runDetail]);

  const comparisonReliabilityData = useMemo(() => {
    return completedComparedRuns.map((run) => {
      const rel = run.analysis?.reliability ?? {};
      const cfn = rel.cfn ?? rel.gnb ?? {};
      const vfn = rel.vfn ?? {};
      return {
        id: run.id,
        label: runLabel(run),
        scenarioLabel: SCENARIO_LABELS[run.scenario] || run.scenario,
        successPct: Number(run.metrics?.successRate ?? 0) * 100,
        e2ePct: Number(rel.e2eReliability ?? 0) * 100,
        ulPct: Number(rel.uplinkReliability ?? 0) * 100,
        dlPct: Number(rel.downlinkReliability ?? 0) * 100,
        deadlinePct: Number(rel.tasksSent ?? 0) > 0 ? (Number(rel.tasksDeadlineOk ?? 0) / Number(rel.tasksSent ?? 0)) * 100 : null,
        cfnFailurePct: Number(cfn.failureRate ?? 0) * 100,
        vfnFailurePct: Number(vfn.failureRate ?? 0) * 100,
        avgDelayMs: Number(run.analysis?.delayComponents?.completion ?? run.metrics?.avgCompletionDelayS ?? 0) * 1000,
        tasksSent: Number(rel.tasksSent ?? 0),
        tasksDeadlineOk: Number(rel.tasksDeadlineOk ?? 0),
      };
    });
  }, [completedComparedRuns, runLabel]);

  const densityDelayData = useMemo(() => {
    if (!completedComparedRuns.length) return [];
    const scenarioSet = new Set();
    const densityMap = new Map();

    for (const run of completedComparedRuns) {
      const scenario = run.scenario;
      const density = Number(run.params?.numVehicles ?? 0);
      if (!Number.isFinite(density)) continue;
      scenarioSet.add(scenario);
      if (!densityMap.has(density)) densityMap.set(density, {});
      const row = densityMap.get(density);
      if (!row[scenario]) row[scenario] = { delaySum: 0, successSum: 0, count: 0 };
      row[scenario].delaySum += Number(run.metrics?.avgCompletionDelayS ?? 0) * 1000;
      row[scenario].successSum += Number(run.metrics?.successRate ?? 0) * 100;
      row[scenario].count += 1;
    }

    return [...densityMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([density, byScenario]) => {
        const row = { density };
        for (const scenario of scenarioSet) {
          const agg = byScenario[scenario];
          row[`${scenario}_delay`] = agg ? agg.delaySum / agg.count : null;
          row[`${scenario}_success`] = agg ? agg.successSum / agg.count : null;
        }
        return row;
      });
  }, [completedComparedRuns]);

  const comparedScenarios = useMemo(() => {
    return [...new Set(completedComparedRuns.map((run) => run.scenario))];
  }, [completedComparedRuns]);

  const mergedDelayData = useMemo(() => {
    return completedComparedRuns.map((run) => {
      const c = run.analysis?.delayComponents ?? {};
      const shares = c.shares ?? {};
      return {
        id: run.id,
        label: runLabel(run),
        transportMs: Number(c.transport ?? 0) * 1000,
        queueingMs: Number(c.queueing ?? 0) * 1000,
        serviceMs: Number(c.service ?? 0) * 1000,
        transportPct: Number(shares.transport ?? 0) * 100,
        queueingPct: Number(shares.queueing ?? 0) * 100,
        servicePct: Number(shares.service ?? 0) * 100,
      };
    });
  }, [completedComparedRuns, runLabel]);

  const reliability = runDetail?.analysis?.reliability ?? null;

  const currentFrame = mapData?.frames?.[frameIndex] ?? null;

  /* ── render ── */
  return (
    <div className="space-y-8">
      {/* ─── Control Panel ─── */}
      <div className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-sm font-semibold tracking-wide uppercase text-zinc-700 dark:text-zinc-200">
            Simulation Controls
          </h4>
          <span className="ml-auto text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
            queue:{queueDepth} · {activeRunId ? `running:${activeRunId.slice(-6)}` : 'idle'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Access Mode
            <select
              value={params.accessMode}
              onChange={(e) => setParams((p) => ({
                ...p,
                accessMode: e.target.value,
                numGnbs: e.target.value === 'DSRC_DIRECT' ? 0 : Math.max(1, p.numGnbs || 1),
                numCFNs: e.target.value === 'DSRC_DIRECT' ? 0 : p.numCFNs,
                scenario: e.target.value === 'DSRC_DIRECT' ? 'S2_VFN_ONLY' : p.scenario,
              }))}
              className="w-56 h-9 px-2 text-xs font-mono border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 outline-none transition-colors"
            >
              {Object.entries(ACCESS_MODE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <Param label="Cars" value={params.numVehicles} min={1} max={150} set={(v) => setParams((p) => ({ ...p, numVehicles: v }))} />
          <Param
            label="gNBs"
            value={params.numGnbs}
            min={0}
            max={30}
            disabled={isDsrcMode}
            set={(v) => setParams((p) => ({ ...p, numGnbs: v }))}
          />
          <Param label="VFCs" value={params.numVFCs} min={0} max={50} set={(v) => setParams((p) => ({ ...p, numVFCs: v }))} />
          <Param
            label="CFNs"
            value={params.numCFNs}
            min={0}
            max={50}
            disabled={isDsrcMode}
            set={(v) => setParams((p) => ({ ...p, numCFNs: v }))}
          />
          <Param label="Time (s)" value={params.simTime} min={5} max={120} set={(v) => setParams((p) => ({ ...p, simTime: v }))} />

          <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Situation
            <select
              value={params.scenario}
              onChange={(e) => setParams((p) => ({ ...p, scenario: e.target.value }))}
              disabled={isDsrcMode}
              className="w-44 h-9 px-2 text-xs font-mono border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 outline-none transition-colors"
            >
              {SCENARIO_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value === 'AUTO' ? 'AUTO (from CFN/VFC counts)' : SCENARIO_LABELS[value]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Run Name
            <input
              type="text"
              value={params.runName}
              onChange={(e) => setParams((p) => ({ ...p, runName: e.target.value.slice(0, 80) }))}
              placeholder="e.g. Peak S3 seed01"
              className="w-56 h-9 px-2 text-xs font-mono border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 outline-none transition-colors"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="h-9 px-5 text-xs font-semibold tracking-wide uppercase border border-zinc-900 dark:border-zinc-400 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center gap-2 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Queue
          </button>

          <button
            type="button"
            disabled={!activeRunId || canceling}
            onClick={handleCancelActiveRun}
            className="h-9 px-5 text-xs font-semibold tracking-wide uppercase border border-red-700 text-red-700 dark:border-red-400 dark:text-red-300 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
          >
            {canceling ? <Loader2 size={14} className="animate-spin" /> : <Square size={14} />}
            Cancel Active
          </button>
        </form>

        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
            Suggested Methodology Presets (100s)
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SETUPS.map((setup) => (
              <button
                key={setup.label}
                type="button"
                onClick={() => applySuggestedSetup(setup)}
                className="px-3 py-1.5 text-[11px] border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:border-zinc-500 dark:hover:border-zinc-400 transition-colors"
              >
                {setup.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-700 px-3 py-2">
            {error}
          </p>
        )}
      </div>

      {/* ─── Run History (collapsible) ─── */}
      <button
        onClick={() => setShowHistory((p) => !p)}
        className="w-full flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-2 border-b border-zinc-200 dark:border-zinc-700"
      >
        <span>Run History ({visibleRuns.length}/{runs.length})</span>
        {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <div className="flex items-center justify-end">
        <label className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          Situation Filter
          <select
            value={historyScenarioFilter}
            onChange={(e) => setHistoryScenarioFilter(e.target.value)}
            className="h-7 px-2 border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-[10px] font-mono"
          >
            <option value="ALL">ALL</option>
            {SCENARIO_VALUES.filter((v) => v !== 'AUTO').map((value) => (
              <option key={value} value={value}>
                {SCENARIO_LABELS[value] || value}
              </option>
            ))}
          </select>
        </label>
      </div>

      {showHistory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 animate-fade-up">
          {visibleRuns.map((run) => (
            <div
              key={run.id}
              className={`text-left p-3 border transition-all ${selectedRunId === run.id
                ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                }`}
            >
              <button type="button" onClick={() => setSelectedRunId(run.id)} className="w-full text-left">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-100 truncate">{run.name || run.id.slice(-8)}</div>
                    <div className="text-[10px] font-mono text-zinc-400">{run.id.slice(-8)}</div>
                  </div>
                  <StatusDot status={run.status} />
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {run.params.numVehicles}c · {run.params.numGnbs}g · {run.params.numVFCs}v · {run.params.numCFNs}f
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {SCENARIO_LABELS[run.scenario] || run.scenario}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  {ACCESS_MODE_LABELS[run.accessMode || 'NR'] || (run.accessMode || 'NR')}
                </div>
                {run.metrics?.avgCompletionDelayS !== undefined && (
                  <div className="text-[10px] text-zinc-400 mt-0.5">{(Number(run.metrics.avgCompletionDelayS) * 1000).toFixed(1)}ms avg</div>
                )}
              </button>
              <div className="mt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => toggleCompareRun(run.id)}
                  className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wide ${compareRunIds.includes(run.id)
                    ? 'text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  title="Toggle for multi-run comparison graphs"
                >
                  <span
                    className={`inline-block w-2 h-2 border ${compareRunIds.includes(run.id) ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100' : 'border-zinc-400 dark:border-zinc-500'}`}
                  />
                  Compare
                </button>
                <button
                  type="button"
                  disabled={deletingRunId === run.id || run.status === 'running'}
                  onClick={() => handleDeleteRun(run.id)}
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 disabled:opacity-40"
                  title={run.status === 'running' ? 'Cancel run before deleting' : 'Delete run'}
                >
                  {deletingRunId === run.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!visibleRuns.length && <p className="text-xs text-zinc-400 col-span-full">No runs match this situation filter.</p>}
        </div>
      )}

      {!!compareRunIds.length && (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Comparison set: {compareRunIds.length} run{compareRunIds.length === 1 ? '' : 's'} selected.
        </p>
      )}

      {/* ─── Results ─── */}
      {!runDetail && (
        <div className="text-center py-12 text-sm text-zinc-400 dark:text-zinc-500 font-light">
          Queue a simulation or select a run to view results.
        </div>
      )}

      {runDetail && (
        <>
          <div className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-800/30 p-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Selected Run</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{runDetail.name || runDetail.id.slice(-8)}</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{runDetail.id.slice(-8)} · {SCENARIO_LABELS[runDetail.scenario] || runDetail.scenario}</p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">{ACCESS_MODE_LABELS[runDetail.accessMode || 'NR'] || (runDetail.accessMode || 'NR')}</p>
            </div>
            <div className="flex items-end gap-2">
              <label className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400 flex flex-col gap-1">
                Rename Result
                <input
                  type="text"
                  value={renameDraft}
                  onChange={(e) => setRenameDraft(e.target.value.slice(0, 80))}
                  className="w-64 h-9 px-2 text-xs font-mono border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 outline-none transition-colors"
                />
              </label>
              <button
                type="button"
                disabled={renaming || !renameDraft.trim()}
                onClick={handleRenameRun}
                className="h-9 px-3 text-xs uppercase tracking-wide border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:border-zinc-500 dark:hover:border-zinc-400 transition-colors disabled:opacity-40 inline-flex items-center gap-1"
              >
                {renaming ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                Save
              </button>
            </div>
          </div>

          {/* Failed banner */}
          {runDetail.status === 'failed' && runDetail.error && (
            <div className="border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-xs text-red-700 dark:text-red-300">
              <strong>Run failed:</strong> {runDetail.error}
            </div>
          )}

          {/* Metrics strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700">
            <Stat label="Status" value={runDetail.status.toUpperCase()} mono />
            <Stat label="Success" value={runDetail.metrics?.successRate !== undefined ? `${(Number(runDetail.metrics.successRate) * 100).toFixed(1)}%` : '—'} />
            <Stat label="Avg Delay" value={runDetail.metrics?.avgCompletionDelayS !== undefined ? `${(Number(runDetail.metrics.avgCompletionDelayS) * 1000).toFixed(1)}ms` : '—'} />
            <Stat label="Tasks" value={runDetail.metrics?.processedTasks ?? '—'} />
          </div>

          {reliability && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Chart title="Reliability Pipeline">
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="Tasks Sent" value={formatCount(reliability.tasksSent)} />
                  <MiniStat label="Reached Fog" value={formatCountWithPct(reliability.tasksReachingFog, reliability.tasksSent)} />
                  <MiniStat label="Responses Sent" value={formatCountWithPct(reliability.responsesSentByFog, reliability.tasksSent)} />
                  <MiniStat label="Responses Received" value={formatCountWithPct(reliability.responsesReceivedByCar, reliability.tasksSent)} />
                  <MiniStat label="Deadline OK" value={formatCountWithPct(reliability.tasksDeadlineOk, reliability.tasksSent)} />
                  <MiniStat label="E2E Reliability" value={formatRatio(reliability.e2eReliability)} />
                  <MiniStat label="UL Reliability" value={formatRatio(reliability.uplinkReliability)} />
                  <MiniStat label="DL Reliability" value={formatRatio(reliability.downlinkReliability)} />
                </div>
              </Chart>
              <Chart title="Loss / Radio Evidence">
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <MiniStat label="Pre-Fog Loss" value={formatCountWithPct(reliability.preFogLossCount, reliability.tasksSent)} />
                    <MiniStat label="Return-Path Loss" value={formatCountWithPct(reliability.returnPathLossCount, reliability.tasksSent)} />
                    <MiniStat label="Deadline Miss" value={formatCountWithPct(reliability.deadlineMissAfterFogCount, reliability.tasksSent)} />
                    <MiniStat label="Fog Reassoc" value={formatCount(reliability.fogReassociationEvents)} />
                    <MiniStat label="Handover Events" value={formatCount(reliability.handoverEvents)} />
                    <MiniStat label="CFN Tx/Rx" value={`${formatCount(reliability.cfn?.tx ?? reliability.gnb?.tx)} / ${formatCount(reliability.cfn?.rx ?? reliability.gnb?.rx)} (${formatRatio(reliability.cfn?.failureRate ?? reliability.gnb?.failureRate, true)} fail)`} />
                    <MiniStat label="VFN Tx/Rx" value={`${formatCount(reliability.vfn?.tx)} / ${formatCount(reliability.vfn?.rx)} (${formatRatio(reliability.vfn?.failureRate, true)} fail)`} />
                    <MiniStat label="DL RLC TxDrop" value={formatCount(reliability.dlRlc?.txDrop)} />
                  </div>
                </div>
              </Chart>
            </div>
          )}

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Chart title="Relative Velocity vs Failure Rate (Selected Run)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={failureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                  <XAxis dataKey="velocityBin" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="rate" domain={[0, 1]} tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="count" orientation="right" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, name) => (name?.includes('Tx Count') ? Number(v).toLocaleString() : (v == null ? '—' : `${(Number(v) * 100).toFixed(1)}%`))}
                    contentStyle={tooltipStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="rate" dataKey="CFN" name="CFN Failure" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar yAxisId="rate" dataKey="VFN" name="VFN Failure" fill="#a855f7" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="count" type="monotone" dataKey="cfnTxCount" name="CFN Tx Count" stroke="#0f172a" strokeWidth={1.5} dot={{ r: 2 }} />
                  <Line yAxisId="count" type="monotone" dataKey="vfnTxCount" name="VFN Tx Count" stroke="#6d28d9" strokeWidth={1.5} dot={{ r: 2 }} />
                </BarChart>
              </ResponsiveContainer>
            </Chart>

            <Chart title="Cross-Scenario Reliability (Comparison Set)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={comparisonReliabilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="successPct" name="Success %" fill="#16a34a" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="ulPct" name="UL Reliability %" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="dlPct" name="DL Reliability %" fill="#14b8a6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="cfnFailurePct" name="CFN Failure %" fill="#2563eb" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="vfnFailurePct" name="VFN Failure %" fill="#7c3aed" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Chart title="Vehicle Density vs Delay / Success (Comparison Set)">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={densityDelayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                  <XAxis dataKey="density" tick={{ fontSize: 11 }} label={{ value: 'Vehicles', position: 'insideBottom', offset: -4, fontSize: 11 }} />
                  <YAxis yAxisId="delay" tick={{ fontSize: 11 }} label={{ value: 'Delay (ms)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <YAxis yAxisId="success" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} label={{ value: 'Success (%)', angle: 90, position: 'insideRight', fontSize: 11 }} />
                  <Tooltip formatter={(v, key) => (String(key).includes('_success') ? `${Number(v).toFixed(1)}%` : `${Number(v).toFixed(2)}ms`)} contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {comparedScenarios.map((scenario, idx) => {
                    const color = SCENARIO_COLORS[idx % SCENARIO_COLORS.length];
                    const label = SCENARIO_LABELS[scenario] || scenario;
                    return (
                      <React.Fragment key={scenario}>
                        <Line yAxisId="delay" type="monotone" dataKey={`${scenario}_delay`} name={`${label} Delay`} stroke={color} strokeWidth={2} dot={{ r: 2 }} connectNulls />
                        <Line yAxisId="success" type="monotone" dataKey={`${scenario}_success`} name={`${label} Success`} stroke={color} strokeWidth={1.4} strokeDasharray="4 2" dot={false} connectNulls />
                      </React.Fragment>
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </Chart>

            <Chart title="Delay Components + Share (Comparison Set)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={mergedDelayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Delay (ms)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, name, info) => {
                      const cfg = DELAY_KEYS.find((entry) => entry.name === name);
                      const pct = cfg ? info?.payload?.[cfg.pctKey] : null;
                      return [`${Number(v).toFixed(2)}ms${pct != null ? ` (${Number(pct).toFixed(1)}%)` : ''}`, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {DELAY_KEYS.map((entry) => (
                    <Bar key={entry.key} dataKey={entry.key} name={entry.name} stackId="delay" fill={entry.color}>
                      <LabelList
                        dataKey={entry.pctKey}
                        position="center"
                        formatter={(value) => (Number(value) >= 10 ? `${Number(value).toFixed(0)}%` : '')}
                        fill="#ffffff"
                        fontSize={10}
                      />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </div>

          <Chart title="Comparison Table (Performance + Reliability)">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    <th className="text-left py-2 pr-3">Run</th>
                    <th className="text-left py-2 pr-3">Scenario</th>
                    <th className="text-right py-2 pr-3">Tasks Sent</th>
                    <th className="text-right py-2 pr-3">Deadline OK</th>
                    <th className="text-right py-2 pr-3">Success %</th>
                    <th className="text-right py-2 pr-3">E2E %</th>
                    <th className="text-right py-2 pr-3">UL %</th>
                    <th className="text-right py-2 pr-3">DL %</th>
                    <th className="text-right py-2 pr-3">CFN Fail %</th>
                    <th className="text-right py-2 pr-3">VFN Fail %</th>
                    <th className="text-right py-2 pr-3">Avg Delay</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonReliabilityData.map((row) => (
                    <tr key={row.id} className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                      <td className="py-2 pr-3 font-medium">{row.label}</td>
                      <td className="py-2 pr-3">{row.scenarioLabel}</td>
                      <td className="py-2 pr-3 text-right">{formatCount(row.tasksSent)}</td>
                      <td className="py-2 pr-3 text-right">{formatCountWithPct(row.tasksDeadlineOk, row.tasksSent)}</td>
                      <td className="py-2 pr-3 text-right">{formatPercent(row.successPct)}</td>
                      <td className="py-2 pr-3 text-right">{formatPercent(row.e2ePct)}</td>
                      <td className="py-2 pr-3 text-right">{formatPercent(row.ulPct)}</td>
                      <td className="py-2 pr-3 text-right">{formatPercent(row.dlPct)}</td>
                      <td className="py-2 pr-3 text-right">{formatPercent(row.cfnFailurePct)}</td>
                      <td className="py-2 pr-3 text-right">{formatPercent(row.vfnFailurePct)}</td>
                      <td className="py-2 pr-3 text-right">{formatMsFromNumber(row.avgDelayMs)}</td>
                    </tr>
                  ))}
                  {!comparisonReliabilityData.length && (
                    <tr>
                      <td colSpan={11} className="py-6 text-center text-zinc-400 dark:text-zinc-500">
                        Add completed runs to the comparison set to populate this table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Chart>

          {/* Map */}
          <div className="border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40">
              <h5 className="text-xs font-semibold tracking-wide uppercase text-zinc-600 dark:text-zinc-300">Map Animation</h5>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="p-1.5 border border-zinc-300 dark:border-zinc-600 hover:border-zinc-500 transition-colors"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {mapData?.frames?.length ? `${frameIndex + 1}/${mapData.frames.length}` : '—/—'}
                </span>
              </div>
            </div>

            {mapData?.frames?.length ? (
              <div>
                <div className="px-4 py-2">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(mapData.frames.length - 1, 0)}
                    value={frameIndex}
                    onChange={(e) => { setFrameIndex(Number(e.target.value)); setIsPlaying(false); }}
                    className="w-full accent-zinc-900 dark:accent-zinc-300"
                  />
                </div>
                <div className="h-[380px]">
                  <MapContainer
                    key={runDetail.id}
                    center={[mapData.center.lat, mapData.center.lon]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {currentFrame?.nodes?.map((node) => (
                      <CircleMarker
                        key={node.id}
                        center={[node.lat, node.lon]}
                        pathOptions={{ color: NODE_COLORS[node.type] || '#71717a', fillColor: NODE_COLORS[node.type] || '#71717a', fillOpacity: 0.85, weight: 1 }}
                        radius={node.type === 'gNB' ? 7 : node.type === 'car' ? 3.5 : 5}
                      >
                        <Popup>
                          <span style={{ fontSize: 11 }}>Node {node.id} ({node.type})<br />t = {currentFrame.time.toFixed(1)}s</span>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
                <div className="px-4 py-3 flex flex-wrap gap-4 text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700">
                  {Object.entries(NODE_COLORS).map(([type, color]) => (
                    <span key={type} className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-xs text-zinc-400 dark:text-zinc-500 font-light">
                Map animation will appear once a run completes.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* ============================================================
   Sub-components
   ============================================================ */

const formatRatio = (value, alreadyPercent = false) => {
  if (value == null) return '—';
  const pct = alreadyPercent ? Number(value) : Number(value) * 100;
  if (!Number.isFinite(pct)) return '—';
  return `${pct.toFixed(1)}%`;
};
const formatPercent = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(1)}%`;
};
const formatCount = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return '0';
  }
  return Math.round(n).toLocaleString();
};
const formatCountWithPct = (value, total) => {
  const n = Number(value);
  const base = Number(total);
  if (!Number.isFinite(n)) return '0';
  if (!Number.isFinite(base) || base <= 0) return formatCount(n);
  return `${formatCount(n)} (${((n / base) * 100).toFixed(1)}%)`;
};
const formatMsFromNumber = (valueMs) => {
  const n = Number(valueMs);
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(1)}ms`;
};

const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.95)',
  border: '1px solid #e4e4e7',
  borderRadius: 0,
  fontSize: 11,
  padding: '6px 10px',
};

const Param = ({ label, value, set, min = 1, max = 50, disabled = false }) => (
  <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
    {label}
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      disabled={disabled}
      onChange={(e) => set(clamp(e.target.value, min, max))}
      className="w-20 h-9 px-2 text-sm font-mono border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 outline-none transition-colors disabled:opacity-40"
    />
  </label>
);

const Chart = ({ title, children }) => (
  <div className="border border-zinc-200 dark:border-zinc-700">
    <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40">
      <h5 className="text-xs font-semibold tracking-wide uppercase text-zinc-600 dark:text-zinc-300">{title}</h5>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="border border-zinc-200 dark:border-zinc-700 px-3 py-2">
    <p className="text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">{label}</p>
    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
  </div>
);

const Stat = ({ label, value, mono }) => (
  <div className="bg-white dark:bg-zinc-900 px-4 py-3">
    <p className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">{label}</p>
    <p className={`text-base font-semibold text-zinc-900 dark:text-zinc-100 ${mono ? 'font-mono text-sm' : ''}`}>{value}</p>
  </div>
);

const StatusDot = ({ status }) => {
  const colors = {
    completed: 'bg-emerald-500',
    running: 'bg-blue-500 animate-pulse',
    queued: 'bg-amber-500',
    failed: 'bg-red-500',
    canceled: 'bg-zinc-500',
  };
  return (
    <span className={`w-1.5 h-1.5 rounded-full inline-block ${colors[status] ?? 'bg-zinc-400'}`} title={status} />
  );
};

export default SimulationLab;
