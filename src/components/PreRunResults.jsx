import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Loader2, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

/* ── Constants ── */
const DENSITY_TIERS = [50, 100, 150];
const ARCH_COLORS = { CFN: '#3b82f6', VFN: '#a855f7' };
const NODE_COLORS = { gNB: '#3b82f6', car: '#22c55e', CFN: '#f59e0b', VFC: '#a855f7' };
const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(24,24,27,0.95)',
  border: '1px solid #3f3f46',
  borderRadius: '4px',
  color: '#e4e4e7',
  fontSize: '11px',
};

/* ── Helpers ── */
const fmt = (v, d = 1) => (v == null ? '—' : Number(v).toFixed(d));
const fmtPct = (v) => (v == null ? '—' : `${(Number(v) * 100).toFixed(1)}%`);
const fmtK = (v) => {
  if (v == null) return '—';
  const n = Number(v);
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
};

/* ── Sub-components ── */
const Stat = ({ label, value, sub, accent }) => (
  <div className="bg-white dark:bg-zinc-900 p-4 text-center">
    <span className={`block text-xl md:text-2xl font-mono font-light ${accent || 'text-zinc-900 dark:text-zinc-100'}`}>
      {value}
    </span>
    <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">{label}</span>
    {sub && <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-0.5">{sub}</span>}
  </div>
);

const ChartCard = ({ title, children, className = '' }) => (
  <div className={`border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 ${className}`}>
    <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
      <h5 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{title}</h5>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

/* ============================================================
   Main Component
   ============================================================ */
const PreRunResults = () => {
  const [allRuns, setAllRuns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDensity, setSelectedDensity] = useState(50);
  const [selectedArch, setSelectedArch] = useState('CFN');
  const [mapData, setMapData] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('compare'); // 'compare' | 'detail'

  /* ── Load consolidated data ── */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/data/sim-runs/runs.json');
        if (!r.ok) throw new Error(`Failed to load: ${r.status}`);
        const d = await r.json();
        setAllRuns(d.runs);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Derived */
  const runsForDensity = useMemo(
    () => (allRuns || []).filter((r) => r.vehicles === selectedDensity),
    [allRuns, selectedDensity],
  );
  const selectedRun = useMemo(
    () => runsForDensity.find((r) => r.architecture === selectedArch) || null,
    [runsForDensity, selectedArch],
  );
  const cfnRun = useMemo(() => runsForDensity.find((r) => r.architecture === 'CFN'), [runsForDensity]);
  const vfnRun = useMemo(() => runsForDensity.find((r) => r.architecture === 'VFN'), [runsForDensity]);

  /* Cross-density comparison data */
  const crossDensityData = useMemo(() => {
    if (!allRuns) return [];
    return DENSITY_TIERS.map((d) => {
      const cfn = allRuns.find((r) => r.vehicles === d && r.architecture === 'CFN');
      const vfn = allRuns.find((r) => r.vehicles === d && r.architecture === 'VFN');
      return {
        density: `${d} veh`,
        cfnSuccess: cfn ? cfn.metrics.successRate * 100 : 0,
        vfnSuccess: vfn ? vfn.metrics.successRate * 100 : 0,
        cfnLoss: cfn ? cfn.reliability.radioLossRatio * 100 : 0,
        vfnLoss: vfn ? vfn.reliability.radioLossRatio * 100 : 0,
        cfnTasks: cfn ? cfn.metrics.totalTasks : 0,
        vfnTasks: vfn ? vfn.metrics.totalTasks : 0,
      };
    });
  }, [allRuns]);

  /* Throughput comparison */
  const throughputData = useMemo(() => {
    if (!allRuns) return [];
    return DENSITY_TIERS.map((d) => {
      const cfn = allRuns.find((r) => r.vehicles === d && r.architecture === 'CFN');
      const vfn = allRuns.find((r) => r.vehicles === d && r.architecture === 'VFN');
      return {
        density: `${d} veh`,
        cfnSent: cfn ? cfn.reliability.totalTx : 0,
        cfnReceived: cfn ? cfn.reliability.totalRx : 0,
        cfnSuccess: cfn ? cfn.metrics.successTasks : 0,
        vfnSent: vfn ? vfn.reliability.totalTx : 0,
        vfnReceived: vfn ? vfn.reliability.totalRx : 0,
        vfnSuccess: vfn ? vfn.metrics.successTasks : 0,
      };
    });
  }, [allRuns]);

  /* Delay comparison */
  const delayCompData = useMemo(() => {
    if (!cfnRun || !vfnRun) return [];
    return [
      { label: 'CFN', transport: cfnRun.metrics.avgMigrationDelay, queue: cfnRun.metrics.avgQueueDelay, service: 5.0, arch: 'CFN' },
      { label: 'VFN', transport: vfnRun.metrics.avgMigrationDelay, queue: vfnRun.metrics.avgQueueDelay, service: 5.0, arch: 'VFN' },
    ];
  }, [cfnRun, vfnRun]);

  /* Map animation */
  const loadMap = useCallback(async (runId) => {
    setMapLoading(true);
    setMapData(null);
    setFrameIndex(0);
    try {
      const r = await fetch(`/data/sim-runs/map-${runId}.json`);
      if (!r.ok) throw new Error('Map data unavailable');
      const d = await r.json();
      setMapData(d);
    } catch {
      setMapData(null);
    } finally {
      setMapLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRun) loadMap(selectedRun.id);
  }, [selectedRun, loadMap]);

  useEffect(() => {
    if (!mapData?.frames?.length || !isPlaying) return;
    const t = setInterval(() => setFrameIndex((p) => (p + 1) % mapData.frames.length), 600);
    return () => clearInterval(t);
  }, [isPlaying, mapData]);

  const currentFrame = mapData?.frames?.[frameIndex] ?? null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin text-zinc-400" />
        <span className="ml-2 text-sm text-zinc-500">Loading simulation results…</span>
      </div>
    );
  }

  if (error || !allRuns) {
    return <p className="text-sm text-red-500 py-8">Error: {error || 'No data'}</p>;
  }

  return (
    <div className="space-y-8">
      {/* ─── View Mode Toggle ─── */}
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={() => setViewMode('compare')}
          className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide border transition-colors ${
            viewMode === 'compare'
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500'
          }`}
        >
          Cross-Density Comparison
        </button>
        <button
          onClick={() => setViewMode('detail')}
          className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide border transition-colors ${
            viewMode === 'detail'
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500'
          }`}
        >
          Single Scenario Detail
        </button>
      </div>

      {viewMode === 'compare' ? (
        /* ═══════════════════════════════════════════════
           COMPARE VIEW — Cross-density charts
           ═══════════════════════════════════════════════ */
        <div className="space-y-6">
          {/* Reliability vs Density */}
          <ChartCard title="End-to-End Task Success Rate vs Vehicle Density">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={crossDensityData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                <XAxis dataKey="density" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="cfnSuccess" name="CFN Success %" fill={ARCH_COLORS.CFN} radius={[3, 3, 0, 0]} />
                <Bar dataKey="vfnSuccess" name="VFN Success %" fill={ARCH_COLORS.VFN} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
              Both architectures achieve identical performance at 50 vehicles (99.5%). A meaningful gap emerges only at 150 vehicles, where CFN leads by 4.4pp due to VFN's mobility-induced reassociation overhead.
            </p>
          </ChartCard>

          {/* Radio Loss */}
          <ChartCard title="Radio Access Network Loss Ratio vs Vehicle Density">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={crossDensityData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                <XAxis dataKey="density" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="cfnLoss" name="CFN Radio Loss %" fill={ARCH_COLORS.CFN} radius={[3, 3, 0, 0]} />
                <Bar dataKey="vfnLoss" name="VFN Radio Loss %" fill={ARCH_COLORS.VFN} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
              The RAN is the dominant bottleneck. At 150 vehicles the uplink loss exceeds 47%, confirming the scalability cliff at ~33–50 vehicles per gNB.
            </p>
          </ChartCard>

          {/* Throughput Pipeline */}
          <ChartCard title="Absolute Task Throughput Pipeline">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={throughputData} barGap={2} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                <XAxis dataKey="density" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtK} />
                <Tooltip formatter={(v) => Number(v).toLocaleString()} contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="cfnSent" name="CFN Sent" fill="#93c5fd" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cfnReceived" name="CFN Fog-Received" fill="#60a5fa" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cfnSuccess" name="CFN E2E Success" fill="#2563eb" radius={[2, 2, 0, 0]} />
                <Bar dataKey="vfnSent" name="VFN Sent" fill="#d8b4fe" radius={[2, 2, 0, 0]} />
                <Bar dataKey="vfnReceived" name="VFN Fog-Received" fill="#c084fc" radius={[2, 2, 0, 0]} />
                <Bar dataKey="vfnSuccess" name="VFN E2E Success" fill="#7c3aed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
              CFN handles ~40% more tasks at 150 vehicles (15,410 vs 11,025 E2E successes) due to its uniform spatial coverage. The gap between Sent and Fog-Received reveals the radio loss.
            </p>
          </ChartCard>

          {/* Summary table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-2 px-3 text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider text-[10px]">Scenario</th>
                  <th className="text-right py-2 px-3 text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider text-[10px]">Tasks Tx</th>
                  <th className="text-right py-2 px-3 text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider text-[10px]">Tasks Success</th>
                  <th className="text-right py-2 px-3 text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider text-[10px]">Success Rate</th>
                  <th className="text-right py-2 px-3 text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider text-[10px]">Radio Loss</th>
                  <th className="text-right py-2 px-3 text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider text-[10px]">Avg Delay</th>
                </tr>
              </thead>
              <tbody>
                {allRuns.map((run) => (
                  <tr key={run.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="py-2 px-3 text-zinc-800 dark:text-zinc-200 font-medium">
                      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: ARCH_COLORS[run.architecture] }} />
                      {run.label}
                    </td>
                    <td className="text-right py-2 px-3 font-mono text-zinc-600 dark:text-zinc-400">{run.reliability.totalTx.toLocaleString()}</td>
                    <td className="text-right py-2 px-3 font-mono text-zinc-600 dark:text-zinc-400">{run.metrics.successTasks.toLocaleString()}</td>
                    <td className="text-right py-2 px-3 font-mono text-zinc-800 dark:text-zinc-200 font-medium">{fmtPct(run.metrics.successRate)}</td>
                    <td className="text-right py-2 px-3 font-mono text-red-600 dark:text-red-400">{fmtPct(run.reliability.radioLossRatio)}</td>
                    <td className="text-right py-2 px-3 font-mono text-zinc-600 dark:text-zinc-400">{fmt(run.metrics.avgCompletionDelay)}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════
           DETAIL VIEW — Single scenario
           ═══════════════════════════════════════════════ */
        <div className="space-y-6">
          {/* Density + Architecture selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400 font-medium">Density:</span>
            {DENSITY_TIERS.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDensity(d)}
                className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                  selectedDensity === d
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500'
                }`}
              >
                {d} vehicles
              </button>
            ))}
            <span className="text-zinc-300 dark:text-zinc-600 mx-1">|</span>
            <span className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400 font-medium">Architecture:</span>
            {['CFN', 'VFN'].map((a) => (
              <button
                key={a}
                onClick={() => setSelectedArch(a)}
                className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                  selectedArch === a
                    ? `border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900`
                    : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500'
                }`}
                style={selectedArch === a ? { backgroundColor: ARCH_COLORS[a] } : {}}
              >
                {a === 'CFN' ? 'CFN (Roadside)' : 'VFN (Bus-Mounted)'}
              </button>
            ))}
          </div>

          {selectedRun && (
            <>
              {/* Metrics strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700">
                <Stat label="Success Rate" value={fmtPct(selectedRun.metrics.successRate)} />
                <Stat label="Total Tasks" value={selectedRun.metrics.totalTasks.toLocaleString()} />
                <Stat label="Avg Delay" value={`${fmt(selectedRun.metrics.avgCompletionDelay)}ms`} />
                <Stat label="Radio Loss" value={fmtPct(selectedRun.reliability.radioLossRatio)} accent="text-red-500" />
                <Stat label="Queue Delay" value={`${fmt(selectedRun.metrics.avgQueueDelay, 3)}ms`} />
                <Stat label="Migration Delay" value={`${fmt(selectedRun.metrics.avgMigrationDelay, 2)}ms`} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Delay distribution */}
                <ChartCard title="Task Completion Delay Distribution">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={selectedRun.delayDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                      <XAxis dataKey="bucket" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="count" name="Tasks" fill={ARCH_COLORS[selectedArch]} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Velocity-failure */}
                <ChartCard title="Failure Rate vs Relative Velocity">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={selectedRun.velocityFailure.filter((d) => d.txCount > 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                      <XAxis dataKey="velocityBin" tick={{ fontSize: 10 }} label={{ value: 'km/h', position: 'insideBottomRight', fontSize: 10, offset: -5 }} />
                      <YAxis yAxisId="rate" domain={[0, 'auto']} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="count" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(v, name) =>
                          name === 'Tx Count' ? Number(v).toLocaleString() : `${(Number(v) * 100).toFixed(1)}%`
                        }
                        contentStyle={TOOLTIP_STYLE}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="rate" dataKey="failureRate" name="Failure Rate" fill={ARCH_COLORS[selectedArch]} radius={[2, 2, 0, 0]} />
                      <Line yAxisId="count" type="monotone" dataKey="txCount" name="Tx Count" stroke="#71717a" strokeWidth={1.5} dot={{ r: 2 }} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Throughput over time */}
              <ChartCard title="Task Throughput Over Time">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={selectedRun.throughputPerSec}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} label={{ value: 'Time (s)', position: 'insideBottomRight', fontSize: 10, offset: -5 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="tasks" name="Tasks/s" stroke={ARCH_COLORS[selectedArch]} fill={ARCH_COLORS[selectedArch]} fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Delay component comparison */}
              {delayCompData.length > 0 && (
                <ChartCard title={`Delay Breakdown — ${selectedDensity} Vehicles`}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={delayCompData} layout="vertical" barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e4e4e7)" />
                      <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v.toFixed(1)}ms`} />
                      <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={40} />
                      <Tooltip formatter={(v) => `${Number(v).toFixed(3)}ms`} contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="transport" name="Transport (Migration)" stackId="a" fill="#6366f1" />
                      <Bar dataKey="queue" name="Queue" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="service" name="Service (5ms fixed)" stackId="a" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
                    Service time is fixed at 5ms (M/D/1 processing model). Queue delays remain negligible ({'\u003c'}0.22ms) even at 150 vehicles, confirming fog compute is not the bottleneck.
                  </p>
                </ChartCard>
              )}

              {/* Map animation */}
              <ChartCard title={`Map Animation — ${selectedRun.label}`}>
                {mapLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={18} className="animate-spin text-zinc-400" />
                    <span className="ml-2 text-xs text-zinc-500">Loading map data…</span>
                  </div>
                ) : mapData?.frames?.length ? (
                  <div className="space-y-3">
                    <div className="rounded overflow-hidden border border-zinc-200 dark:border-zinc-700" style={{ height: '360px' }}>
                      <MapContainer
                        center={mapData.center || [53.4808, -2.2426]}
                        zoom={mapData.zoom || 15}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                          attribution='&copy; OSM contributors &copy; CARTO'
                        />
                        {currentFrame?.nodes?.map((node) => (
                          <CircleMarker
                            key={node.id}
                            center={[node.lat, node.lon]}
                            radius={node.type === 'gNB' ? 6 : node.type === 'CFN' || node.type === 'VFC' ? 5 : 3}
                            fillColor={NODE_COLORS[node.type] || '#22c55e'}
                            fillOpacity={0.85}
                            stroke={false}
                          >
                            <Popup><span className="text-xs">{node.type} #{node.id}</span></Popup>
                          </CircleMarker>
                        ))}
                      </MapContainer>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying((p) => !p)}
                        className="w-8 h-8 flex items-center justify-center border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:border-zinc-500 transition-colors"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button onClick={() => setFrameIndex((p) => Math.max(0, p - 1))} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                        <ChevronLeft size={16} />
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, (mapData?.frames?.length || 1) - 1)}
                        value={frameIndex}
                        onChange={(e) => { setIsPlaying(false); setFrameIndex(Number(e.target.value)); }}
                        className="flex-1 h-1 accent-zinc-600"
                      />
                      <button onClick={() => setFrameIndex((p) => Math.min((mapData?.frames?.length || 1) - 1, p + 1))} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                        <ChevronRight size={16} />
                      </button>
                      <span className="text-[11px] font-mono text-zinc-400 w-24 text-right">
                        {currentFrame?.time != null ? `t = ${Number(currentFrame.time).toFixed(1)}s` : ''} ({frameIndex + 1}/{mapData.frames.length})
                      </span>
                    </div>
                    <div className="flex gap-4 text-[10px] text-zinc-500 dark:text-zinc-400">
                      {Object.entries(NODE_COLORS).map(([type, color]) => (
                        <span key={type} className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                          {type === 'VFC' ? 'VFN' : type}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 py-8 text-center">Map animation data not available for this run.</p>
                )}
              </ChartCard>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PreRunResults;
